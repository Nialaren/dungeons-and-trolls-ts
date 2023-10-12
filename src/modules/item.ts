import {
    DungeonsandtrollsAttributes,
    DungeonsandtrollsCharacter,
    DungeonsandtrollsItem,
    DungeonsandtrollsItemType,
    DungeonsandtrollsSkill,
} from '../dungeons_and_trolls_ts/api';
import { evaluateAttributes, evaluateParameters } from './attributes';
import { estimateSkillValue } from './skill';

export const ITEM_TYPES: DungeonsandtrollsItemType[] = [
    DungeonsandtrollsItemType.MainHand,
    DungeonsandtrollsItemType.OffHand,
    DungeonsandtrollsItemType.Head,
    DungeonsandtrollsItemType.Body,
    DungeonsandtrollsItemType.Legs,
    DungeonsandtrollsItemType.Neck,
];

export function filterBuyable(
    shopItems: DungeonsandtrollsItem[],
    budget: number,
    slot?: DungeonsandtrollsItemType,
) {
    if (slot) {
        return shopItems.filter((item) => (item.slot! === slot && item.price! <= budget));
    }
    return shopItems.filter((item) => (item.price! <= budget));
}


export function currentPriceOfSet(items: DungeonsandtrollsItem[]) {
    return items.reduce((acc, item) => acc + (item.price || 0), 0);
}

export function findBestDamageSkill(skills: DungeonsandtrollsSkill[], characterAttributes: DungeonsandtrollsAttributes) {
    return skills.reduce((bestSoFar, current) => {
        const bestCurrentValue = !current.damageAmount
            ? 0
            : evaluateParameters(current.damageAmount!, characterAttributes);
        const bestValue = !bestSoFar.damageAmount
            ? 0
            : evaluateParameters(bestSoFar.damageAmount!, characterAttributes);

        return bestValue > bestCurrentValue
            ? bestSoFar
            : current;
    });
}

export function findItemWithBestAttackSkill(
    items: DungeonsandtrollsItem[],
    character: DungeonsandtrollsCharacter,
): DungeonsandtrollsItem | undefined  {
    const itemsWithDamageSkill = items.filter((item) => {
        if (item.skills && item.skills.length > 0) {
            return item.skills.some((skill) => (!!skill.damageAmount));
        }
        return false;
    });

    if (itemsWithDamageSkill.length === 0) {
        return;
    }

    return itemsWithDamageSkill.reduce((bestItem, currentItem) => {
        const bestSkillSoFar = findBestDamageSkill(bestItem.skills!, character.attributes!);
        const bestSkillFortCurrentItem = findBestDamageSkill(currentItem.skills!, character.attributes!);

        const bestCurrentValue = !bestSkillFortCurrentItem.damageAmount
            ? 0
            : estimateSkillValue(bestSkillFortCurrentItem.damageAmount!, character.attributes!);
        const bestValue = !bestSkillSoFar.damageAmount
            ? 0
            : estimateSkillValue(bestSkillSoFar.damageAmount!, character.attributes!);

        return bestCurrentValue > bestValue ? currentItem : bestItem;
    });
}