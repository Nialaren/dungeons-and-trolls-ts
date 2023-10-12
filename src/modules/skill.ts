import { DungeonsandtrollsAttributes, DungeonsandtrollsSkill, DungeonsandtrollsSkillAttributes } from '../dungeons_and_trolls_ts/model/models';
import { attibutesToArray, evaluateAttributes, evaluateParameters } from './attributes';


export function isDamageSkill(skill: DungeonsandtrollsSkill): boolean {
    return !!skill.damageAmount && Object.keys(skill.damageAmount).length > 0;
}

export function estimateSkillValue(attributes: DungeonsandtrollsAttributes, characterAttributes: DungeonsandtrollsAttributes) {
    return evaluateParameters(attributes, characterAttributes);
}

export function canUseSkill(cost: DungeonsandtrollsAttributes, characterAttributes: DungeonsandtrollsAttributes) {
	return !Object.keys(cost).some((key) => {
		return cost[key] > characterAttributes[key];
	});
}

export function isRestorationSkill(skill: DungeonsandtrollsSkill) {
    const staminaRestSkillAttibutes = skill.casterEffects?.attributes?.stamina;

    if (!staminaRestSkillAttibutes) {
        return false;
    }
    return Object.keys(staminaRestSkillAttibutes).length > 0;
}

const POSITIVE_ATTRIBUTES = [
    'stamina',
    'life',
    'mana'
];

export function estimateRestorationSkillValue(skill: DungeonsandtrollsSkill, characterAttributes: DungeonsandtrollsAttributes) {
    const casterEffectAttributes = skill.casterEffects?.attributes;
    if (!casterEffectAttributes) {
        return 0;
    }

    const attributes = Object.keys(casterEffectAttributes)
        .filter((attrKey) => POSITIVE_ATTRIBUTES.includes(attrKey) && !!casterEffectAttributes[attrKey])
        .map((attrKey) => casterEffectAttributes[attrKey]) as DungeonsandtrollsAttributes[];

    const valuePerAttibute = attributes.map((attrStruct) => {
        return evaluateAttributes(characterAttributes, attrStruct);
    });

    return valuePerAttibute.reduce((acc, val) => acc + val, 0);
}

export function attackSkillBestMultiplier(attackSkill: DungeonsandtrollsSkill) {
    const damageAmount = attackSkill.damageAmount!;
    return Object.keys(damageAmount).reduce((bestKey, currentKey) => {
        if (damageAmount[bestKey] < damageAmount[currentKey]) {
            return currentKey;
        }
        return bestKey;
    });
}