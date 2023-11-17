import logger from '../logger';
import {
	DungeonsandtrollsCharacter,
    DungeonsandtrollsItem,
    DungeonsandtrollsItemType,
    DungeonsandtrollsSkill,
} from '../dungeons_and_trolls_ts/model/models';
import { evaluateParameters } from './attributes';
import {
    ITEM_TYPES,
    currentPriceOfSet,
    filterBuyable,
    findBestDamageSkill,
    findItemWithBestAttackSkill,
    requirementsSatisfied,
} from './item';
import { awesomeBuyFunctionv3 as awesomeBuyFunction  } from './awesomeBuyFunction';


function calculateItemValueWithSkill(item: DungeonsandtrollsItem, skill: DungeonsandtrollsSkill) {
    return evaluateParameters(item.attributes!, skill.damageAmount!);
}

function findItemToMaximizeSkill(
    shopItems: DungeonsandtrollsItem[],
    slot: DungeonsandtrollsItemType,
    budget: number,
    skillToMaximize: DungeonsandtrollsSkill,
    currentItems: DungeonsandtrollsItem[],
) {
    const slotItems = filterBuyable(shopItems, budget, slot).filter(((item) => {
        return requirementsSatisfied(currentItems.concat(item));
    }));

    if (slotItems.length === 0) {
        // cant buy anything
        return;
    }
    
    let bestItemSoFar = slotItems[0];
    let bestValue = calculateItemValueWithSkill(bestItemSoFar, skillToMaximize);

    slotItems.forEach((item) => {
        const itemValue = calculateItemValueWithSkill(item, skillToMaximize);
        if (bestValue < itemValue) {
            bestItemSoFar = item;
            bestValue = itemValue;
        }
    });
    return bestItemSoFar;
}

export function isShoppingTime(level: number, character: DungeonsandtrollsCharacter): boolean {
    let budget = character.money || 0;
    if (level > 0 || budget <= 0) {
        return false;
    }
        
    const equipedItems = character.equip || [];
    const equipedSlots = equipedItems.map((item) => item.slot!);

    const emptySlots = ITEM_TYPES.filter((type) => !equipedSlots.includes(type));

    logger.debug(emptySlots, 'EMPTY SLOTS')

    return emptySlots.length > 0;
}

export async function buyItems(
	shopItems: DungeonsandtrollsItem[],
	character: DungeonsandtrollsCharacter,
) {
	let budget = character.money || 0;
    const equipedItems = character.equip || [];
    const equipedSlots = equipedItems.map((item) => item.slot!);

    const itemsToBuy: DungeonsandtrollsItem[] = [];
    let emptySlots = ITEM_TYPES.filter((type) => !equipedSlots.includes(type));

    let itemWithAttackSkill: DungeonsandtrollsItem | undefined = findItemWithBestAttackSkill(character.equip || [], character)
    let attackSkill: DungeonsandtrollsSkill | undefined = itemWithAttackSkill
        ? findBestDamageSkill(itemWithAttackSkill.skills!, character.attributes!)
        : undefined

    if (!attackSkill) {
        const bestItemSet = awesomeBuyFunction(
            shopItems,
            character
        );

        attackSkill = bestItemSet.skill;
        budget -= currentPriceOfSet(bestItemSet.items);

        emptySlots = emptySlots.filter((slot) => !bestItemSet.items.some((item) => item.slot === slot));
        itemsToBuy.push(...bestItemSet.items);
    }

    // Fill rest
    emptySlots.forEach((slot) => {
        const itemToBuy = findItemToMaximizeSkill(
            shopItems,
            slot,
            budget,
            attackSkill!,
            itemsToBuy,
        );

        if (itemToBuy) {
            budget -= (itemToBuy.price || 0);
            itemsToBuy.push(itemToBuy!);
        }
    });

    return itemsToBuy;
}