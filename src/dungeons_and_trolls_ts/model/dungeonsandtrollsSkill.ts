/**
 * Dungeons and Trolls
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.10.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';
import { DungeonsandtrollsAttributes } from './dungeonsandtrollsAttributes';
import { DungeonsandtrollsDamageType } from './dungeonsandtrollsDamageType';
import { DungeonsandtrollsSkillEffect } from './dungeonsandtrollsSkillEffect';
import { DungeonsandtrollsSkillGenericFlags } from './dungeonsandtrollsSkillGenericFlags';
import { SkillTarget } from './skillTarget';

export class DungeonsandtrollsSkill {
    'id'?: string;
    'name'?: string;
    'target'?: SkillTarget;
    'cost'?: DungeonsandtrollsAttributes;
    'range'?: DungeonsandtrollsAttributes;
    'radius'?: DungeonsandtrollsAttributes;
    'duration'?: DungeonsandtrollsAttributes;
    'damageAmount'?: DungeonsandtrollsAttributes;
    'damageType'?: DungeonsandtrollsDamageType;
    'casterEffects'?: DungeonsandtrollsSkillEffect;
    'targetEffects'?: DungeonsandtrollsSkillEffect;
    'flags'?: DungeonsandtrollsSkillGenericFlags;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "target",
            "baseName": "target",
            "type": "SkillTarget"
        },
        {
            "name": "cost",
            "baseName": "cost",
            "type": "DungeonsandtrollsAttributes"
        },
        {
            "name": "range",
            "baseName": "range",
            "type": "DungeonsandtrollsAttributes"
        },
        {
            "name": "radius",
            "baseName": "radius",
            "type": "DungeonsandtrollsAttributes"
        },
        {
            "name": "duration",
            "baseName": "duration",
            "type": "DungeonsandtrollsAttributes"
        },
        {
            "name": "damageAmount",
            "baseName": "damageAmount",
            "type": "DungeonsandtrollsAttributes"
        },
        {
            "name": "damageType",
            "baseName": "damageType",
            "type": "DungeonsandtrollsDamageType"
        },
        {
            "name": "casterEffects",
            "baseName": "casterEffects",
            "type": "DungeonsandtrollsSkillEffect"
        },
        {
            "name": "targetEffects",
            "baseName": "targetEffects",
            "type": "DungeonsandtrollsSkillEffect"
        },
        {
            "name": "flags",
            "baseName": "flags",
            "type": "DungeonsandtrollsSkillGenericFlags"
        }    ];

    static getAttributeTypeMap() {
        return DungeonsandtrollsSkill.attributeTypeMap;
    }
}

export namespace DungeonsandtrollsSkill {
}
