import logger from '../logger';
import {
    DungeonsandtrollsAttributes,
    DungeonsandtrollsCharacter,
    DungeonsandtrollsDamageType,
    DungeonsandtrollsItem,
    DungeonsandtrollsSkill,
    DungeonsandtrollsSkillAttributes,
} from '../dungeons_and_trolls_ts/api';
import { attibutesToArray, attributeKeys, evaluateAttributes, mergeAttributes } from './attributes';
import { ITEM_TYPES, currentPriceOfSet } from './item';
import { attackSkillBestMultiplier, isDamageSkill } from './skill';
import { printToLogDir } from './debug';

interface IItemSet {
    items: DungeonsandtrollsItem[];
    value: number;
    price: number;
    skill: DungeonsandtrollsSkill;
}

const EMPTY_ATTIBUTES = Object.freeze({
    'strength': 0,
    'dexterity': 0,
    'intelligence': 0,
    'willpower': 0,
    'constitution': 0,
    'slashResist': 0,
    'pierceResist': 0,
    'fireResist': 0,
    'poisonResist': 0,
    'electricResist': 0,
    'life': 0,
    'stamina': 0,
    'mana': 0,
    'constant': 0,
});
const ATTRIBUTE_KEYS = Object.freeze(Object.keys(EMPTY_ATTIBUTES));


export function calculateRequirements(items: DungeonsandtrollsItem[]){
    const allRequirements: Record<string, any> = {};
    const allAttributes: Record<string, any> = {};

    items.forEach((item) => {
        const {
            requirements = {},
            attributes = {},
        } = item;

        Object.keys(requirements).forEach((requiremenKey) => {
            allRequirements[requiremenKey] = (allRequirements[requiremenKey] || 0) + (requirements[requiremenKey] || 0);
        });
        Object.keys(attributes).forEach((attributeKey) => {
            allAttributes[attributeKey] = (allAttributes[attributeKey] || 0) + (attributes[attributeKey] || 0);
        });
    });

    return allRequirements;
}

export function requirementsSatisfied(items: DungeonsandtrollsItem[]) {
    const requirements = calculateRequirements(items);

    items.forEach(({ attributes }) => {
        if (attributes) {
            Object.keys(attributes).forEach((requirementKey) => {
                requirements[requirementKey] -= (attributes[requirementKey] || 0);
            });
        }
    });

    const someRequirementsFound = ATTRIBUTE_KEYS.some((key) => requirements[key] > 0);

    return someRequirementsFound ? false : true;
}

function isSlotEmpty(itemSet: IItemSet, itemToCheck: DungeonsandtrollsItem) {
    return !itemSet.items.some((item) => item.slot === itemToCheck.slot);
}

interface IWeights {
    attributes: DungeonsandtrollsAttributes;
    skillDamage: number;
    resists: DungeonsandtrollsAttributes;
}

const EVALUATIONS_WEIGHTS: IWeights = Object.freeze({
    attributes: {
        'strength': 0,
        'dexterity': 0,
        'intelligence': 0,
        'willpower': 0,
        'constitution': 0.1,
        'slashResist': 0.7,
        'pierceResist': 0.7,
        'fireResist': 0.4,
        'poisonResist': 0,
        'electricResist': 0,
        'life': 0,
        'stamina': 0,
        'mana': 0,
        'constant': 1,
    },
    skillDamage: 0.1,
    resists: {
        'slashResist': 0.1,
        'pierceResist': 0.1,
        'fireResist': 0.05,
        // 'poisonResist': 0.05,
    },
    resistPenalty: 6,
});

function evaluateItemSet(itemSet: IItemSet): number {
    const damageMlutiplierAttrKey = attackSkillBestMultiplier(itemSet.skill);
    const damageMultiplierValue = itemSet.skill.damageAmount![damageMlutiplierAttrKey];
    
    
    const attributeWeights: IWeights['attributes'] = {
        ...EVALUATIONS_WEIGHTS.attributes,
    };

    ATTRIBUTE_KEYS.forEach((key) => {
        attributeWeights[key] = attributeWeights[key] * damageMultiplierValue;
    });

    attributeWeights[damageMlutiplierAttrKey] = EVALUATIONS_WEIGHTS.skillDamage + damageMultiplierValue;


    const attributes = mergeAttributes(...itemSet.items.map((item) => item.attributes!));
    const itemWithPassiveSpell = itemSet.items.filter((item) => {
        const passiveSkills = item.skills!.filter((skill) => {
            return skill.flags!.passive;
        });
        return passiveSkills.length > 0
    });

    const passiveSkillAttrObj = new DungeonsandtrollsAttributes();

    const passiveSkillAttributes = itemWithPassiveSpell.map((item) => {
        return item.skills!.reduce((accAttributes, skill) => {
            return mergeAttributes(accAttributes, skill.casterEffects!.attributes! as DungeonsandtrollsAttributes);
        }, passiveSkillAttrObj);
    });

    const value = (
        evaluateAttributes(
            attributeWeights,
            attributes,
            ...passiveSkillAttributes,
        )
    );

    // calculate resist value
    let sum = 0;
    Object.keys(EVALUATIONS_WEIGHTS.resists).forEach((key) => {
        const currentAttrValue = attributes[key] || 0;

        let penalty = 6;

        if (currentAttrValue > 10) {
            penalty -= 1;
        } else if (currentAttrValue === 0) {
            penalty += 2;
        }

        if (penalty > 0) {
            sum -= penalty;
        }
    });

    return value + sum;
}


function createCombinations(
    itemSets: IItemSet[],
    items: DungeonsandtrollsItem[],
    budget: number,
    checkRequiremenst = false,
) {
    const pairs: IItemSet[] = [];
    // create pairs
    itemSets.forEach((itemSet) => {
        items.forEach((item) => {
            if (!isSlotEmpty(itemSet, item)) {
                return;
            }
            const items = itemSet.items.concat(item);
            const newPrice = currentPriceOfSet(items);

            // is Over budget?
            if (newPrice > budget) {
                return;
            }

            if (checkRequiremenst && !requirementsSatisfied(items)) {
                return;
            }

            const newSet: IItemSet = {
                skill: itemSet.skill,
                items,
                price: newPrice,
                value: 0,
            };

            // assign new value
            newSet.value = evaluateItemSet(newSet);

            pairs.push(newSet);
        });
    });
    return pairs;
}

/**
 * 'strength'?: number | null;
    'dexterity'?: number | null;
    'intelligence'?: number | null;
    'willpower'?: number | null;
    'constitution'?: number | null;
    'slashResist'?: number | null;
    'pierceResist'?: number | null;
    'fireResist'?: number | null;
    'poisonResist'?: number | null;
    'electricResist'?: number | null;
    'life'?: number | null;
    'stamina'?: number | null;
    'mana'?: number | null;
    'constant'?: number | null;
 */

const BEST_ITEMS_NUM = 5000;


export function awesomeBuyFunctionv3(
    shopItems: DungeonsandtrollsItem[],
    character: DungeonsandtrollsCharacter,
): IItemSet {
    let currentBudget = character.money || 0;
    let maxBudgetForStartItems = Math.floor(currentBudget / 3);

    const skillWithItemPair = shopItems
        .filter((item) => item.skills!.length > 0)
        .map((item) => {
            return item.skills!.map((skill) => ({
                skill,
                items: [item],
            }));
        })
        .reduce((acc, pair) => acc.concat(pair));

    const startItemSets = skillWithItemPair
        .filter(({ skill }) => isDamageSkill(skill) && skill.damageType === DungeonsandtrollsDamageType.Slash)
        .map((setTemplate) => {
            const set: IItemSet = {
                ...setTemplate,
                price: currentPriceOfSet(setTemplate.items),
                value: 0,
            };
            set.value = evaluateItemSet(set);
            return set;
        });

    const itemsWithChargeSkill = skillWithItemPair.filter(({ skill }) => {
        return skill.name!.toLowerCase().includes('charge');
    }).map((set) => set.items[0]);

    if (itemsWithChargeSkill.length === 0) {
        logger.debug('ZERO CHARGES!');
    }

    // create pairs
    const pairs = createCombinations(startItemSets, itemsWithChargeSkill, maxBudgetForStartItems);

    // sort descending
    pairs.sort((a, b) => (b.value - a.value));

    const numOfRestItems = ITEM_TYPES.length - 2;

    let currentSets = pairs;

    for (let i = 0; i < numOfRestItems; i++) {
        const newCombinations = createCombinations(
            currentSets,
            shopItems,
            currentBudget,
            true,
        );

        if (newCombinations.length === 0) {
            break;
        }

        newCombinations.sort((a, b) => (b.value - a.value));
        currentSets = newCombinations.slice(0, BEST_ITEMS_NUM);
    }

    // filter those that does not satisfy requirements
    const bestItemSets = currentSets.filter((itemSet) => {
        return requirementsSatisfied(itemSet.items);
    });

    if (bestItemSets.length === 0) {
        throw new Error("FUCK");
    }

    const debugObj = bestItemSets.slice(0, 30).map((itemSet) => {
        return {
            price: itemSet.price,
            value: itemSet.value,
            attributes: mergeAttributes(
                ...itemSet.items.map((item) => item.attributes!)
            ),
            requirements: calculateRequirements(itemSet.items),
            skillName: itemSet.skill.name,
            skillDmg: itemSet.skill.damageAmount,
            items: itemSet.items.map((item) => item.name),
            slots: itemSet.items.map((item) => item.slot),
        };
    });
    
    printToLogDir('30-item-sets.json', debugObj);

    return bestItemSets[0];
}
