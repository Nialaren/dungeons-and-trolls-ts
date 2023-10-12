import { DungeonsandtrollsAttributes } from '../dungeons_and_trolls_ts/model/models';

export const attributeKeys = [
	'strength',
    'dexterity',
    'intelligence',
    'willpower',
    'constitution',
    'slashResist',
    'pierceResist',
    'fireResist',
    'poisonResist',
    'electricResist',
    'life',
    'stamina',
    'mana',
	'constant',
];

export function attibutesToArray(attributes: DungeonsandtrollsAttributes) {
	return attributeKeys.map((attrKey) => attributes[attrKey] || 0);
}

export function evaluateParameters(params: DungeonsandtrollsAttributes, attributes: DungeonsandtrollsAttributes) {
	let sum = 0;
	sum += (params.strength || 0) * (attributes.strength || 0);
	sum += (params.dexterity || 0) * (attributes.dexterity || 0);
	sum += (params.intelligence || 0) * (attributes.intelligence || 0);
	sum += (params.willpower || 0) * (attributes.willpower || 0);
	sum += (params.constitution || 0) * (attributes.constitution || 0);
	sum += (params.slashResist || 0) * (attributes.slashResist || 0);
	sum += (params.pierceResist || 0) * (attributes.pierceResist || 0);
	sum += (params.fireResist || 0) * (attributes.fireResist || 0);
	sum += (params.poisonResist || 0) * (attributes.poisonResist || 0);
	sum += (params.electricResist || 0) * (attributes.electricResist || 0);
	sum += (params.life || 0) * (attributes.life || 0);
	sum += (params.stamina || 0) * (attributes.stamina || 0);
	sum += (params.mana || 0) * (attributes.mana || 0);
	sum += (params.constant || 0) * 1;
	return sum;
}

export function evaluateAttributes(...attributes: DungeonsandtrollsAttributes[]) {
	const sumAttrArr = attributes
		.map((attr) => attibutesToArray(attr))
		.reduce((sumAttr, currentAttr) => {
			return sumAttr.map((val, index) => val * currentAttr[index]);
		});

	return sumAttrArr.reduce((acc, val) => acc + val, 0);
}

export function mergeAttributes(...attributes: DungeonsandtrollsAttributes[]) {

	const sumAttr = new DungeonsandtrollsAttributes();
	attributeKeys.forEach((attrKey) => {
		sumAttr[attrKey] = 0;
	});

	attributes.forEach((attr) => {
		attributeKeys.forEach((key) => {
			sumAttr[key] += (attr[key] || 0);
		});
	});
	return sumAttr;
}