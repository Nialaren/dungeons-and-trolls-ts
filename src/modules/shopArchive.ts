import {
    DungeonsandtrollsCharacter,
    DungeonsandtrollsItem,
    DungeonsandtrollsItemType,
} from '../dungeons_and_trolls_ts/api';
import { filterBuyable, findItemWithBestAttackSkill } from './item';

export function findItemToBuy(
    shopItems: DungeonsandtrollsItem[],
    slot: DungeonsandtrollsItemType,
    budget: number,
    skillToMaximize = 'life'
) {
    const slotItems = filterBuyable(shopItems, budget, slot);

    const itemsWithAttr = slotItems.filter((item) => {
        return item.slot! === slot
        && item.attributes![skillToMaximize]
        && item.attributes![skillToMaximize] > 0
    });

    if (itemsWithAttr.length > 0) {
        itemsWithAttr.sort((itemA, itemB) => (itemB.attributes![skillToMaximize] || 0) - (itemA.attributes![skillToMaximize] || 0));
        return itemsWithAttr[0];
    }

    // Old tactics - just buy most expensive
    return slotItems.sort((itemA, itemB) => (itemB.price || 0) - (itemA.price || 0))[0];
}


export function findBestAttackSkillItem(
    shopItems: DungeonsandtrollsItem[],
    character: DungeonsandtrollsCharacter,
    availableSlosts: DungeonsandtrollsItemType[],
    budget: number
) {
    const slotItems = shopItems.filter((item) => {
        return availableSlosts.includes(item.slot!)
            && (item.price || 0) <= budget;
    });

    return findItemWithBestAttackSkill(slotItems, character);
}

export function findItemWithBestProperty(items: DungeonsandtrollsItem[], propertyToSearch: string) {
    return items.reduce((bestSoFar, current) => {
        if (bestSoFar.attributes![propertyToSearch] < current.attributes![propertyToSearch]) {
            return current;
        }
        return bestSoFar;
    });
}