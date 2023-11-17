import logger from '../logger';
import {
    DungeonsandtrollsAttributes,
    DungeonsandtrollsCharacter,
    DungeonsandtrollsDamageType,
    DungeonsandtrollsItem,
    DungeonsandtrollsSkill,
} from '../dungeons_and_trolls_ts/api';
import { evaluateAttributes, mergeAttributes } from './attributes';
import {
    ITEM_TYPES,
    calculateStats,
    currentPriceOfSet,
    requirementsSatisfied,
} from './item';
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
        'slashResist': 0.6,
        'pierceResist': 0.6,
        'fireResist': 0.4,
        'poisonResist': 0.5,
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



function evaluateItems(items: DungeonsandtrollsItem[], skill: DungeonsandtrollsSkill) {
    const damageMlutiplierAttrKey = attackSkillBestMultiplier(skill);
    const damageMultiplierValue = skill.damageAmount![damageMlutiplierAttrKey];
    
    
    const attributeWeights: IWeights['attributes'] = {
        ...EVALUATIONS_WEIGHTS.attributes,
    };

    ATTRIBUTE_KEYS.forEach((key) => {
        attributeWeights[key] = attributeWeights[key] * damageMultiplierValue;
    });

    attributeWeights[damageMlutiplierAttrKey] = EVALUATIONS_WEIGHTS.skillDamage + damageMultiplierValue;


    const attributes = mergeAttributes(...items.map((item) => item.attributes!));
    const itemWithPassiveSpell = items.filter((item) => {
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

function evaluateItemSet(itemSet: IItemSet): number {
    return evaluateItems(itemSet.items, itemSet.skill);
}


function createSetKey(items: DungeonsandtrollsItem[]) {
    return items.map((item) => item.name!).sort().join(';');
}

function createCombinations(
    itemSets: IItemSet[],
    shopItems: DungeonsandtrollsItem[],
    budget: number,
    checkRequiremenst = false,
) {
    const uniqueSets = new Set<string>();
    const pairs: IItemSet[] = [];
    // create pairs
    for (let i = 0; i < itemSets.length; i++) {
        const itemSet = itemSets[i];
        for (let newItemIndex = 0; newItemIndex < shopItems.length; newItemIndex++) {
            const item = shopItems[newItemIndex];

            if (!isSlotEmpty(itemSet, item)) {
                continue;
            }
            const items = itemSet.items.concat(item);

            const setKey = createSetKey(items);

            // already have this combination ?
            if (uniqueSets.has(setKey)) {
                continue;
            }

            const newPrice = currentPriceOfSet(items);

            // is Over budget?
            if (newPrice > budget) {
                continue;
            }

            if (checkRequiremenst && !requirementsSatisfied(items)) {
                continue;
            }

            const newSet: IItemSet = {
                skill: itemSet.skill,
                items,
                price: newPrice,
                value: 0,
            };

            // assign new value
            newSet.value = evaluateItemSet(newSet);

            // add new key
            uniqueSets.add(setKey);
            pairs.push(newSet);
        }
    }
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
        return skill.name!.toLowerCase().split(' ').includes('charge');
    }).map((set) => set.items[0]);

    if (itemsWithChargeSkill.length === 0) {
        logger.debug('ZERO CHARGES!');
    }

    // create pairs
    const pairs = createCombinations(startItemSets, itemsWithChargeSkill, maxBudgetForStartItems);
    
    // sort descending
    pairs.sort((a, b) => (b.value - a.value));


    // logger.info(`${pairs.length} pairs`);
    // printToLogDir('pairs.json', pairs);


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
        const {
            requirements,
            attributes,
        } = calculateStats(itemSet.items);
        return {
            price: itemSet.price,
            value: itemSet.value,
            attributes,
            requirements,
            skillName: itemSet.skill.name,
            skillDmg: itemSet.skill.damageAmount,
            items: itemSet.items.map((item) => item.name),
            slots: itemSet.items.map((item) => item.slot),
        };
    });
    
    printToLogDir('30-item-sets.json', debugObj);

    return bestItemSets[0];
}
