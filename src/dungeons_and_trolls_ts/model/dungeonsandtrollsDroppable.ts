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
import { DungeonsandtrollsDecoration } from './dungeonsandtrollsDecoration';
import { DungeonsandtrollsItem } from './dungeonsandtrollsItem';
import { DungeonsandtrollsKey } from './dungeonsandtrollsKey';
import { DungeonsandtrollsMonster } from './dungeonsandtrollsMonster';
import { DungeonsandtrollsSkill } from './dungeonsandtrollsSkill';
import { DungeonsandtrollsWaypoint } from './dungeonsandtrollsWaypoint';

export class DungeonsandtrollsDroppable {
    'skill'?: DungeonsandtrollsSkill;
    'item'?: DungeonsandtrollsItem;
    'monster'?: DungeonsandtrollsMonster;
    'decoration'?: DungeonsandtrollsDecoration;
    'waypoint'?: DungeonsandtrollsWaypoint;
    'key'?: DungeonsandtrollsKey;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "skill",
            "baseName": "skill",
            "type": "DungeonsandtrollsSkill"
        },
        {
            "name": "item",
            "baseName": "item",
            "type": "DungeonsandtrollsItem"
        },
        {
            "name": "monster",
            "baseName": "monster",
            "type": "DungeonsandtrollsMonster"
        },
        {
            "name": "decoration",
            "baseName": "decoration",
            "type": "DungeonsandtrollsDecoration"
        },
        {
            "name": "waypoint",
            "baseName": "waypoint",
            "type": "DungeonsandtrollsWaypoint"
        },
        {
            "name": "key",
            "baseName": "key",
            "type": "DungeonsandtrollsKey"
        }    ];

    static getAttributeTypeMap() {
        return DungeonsandtrollsDroppable.attributeTypeMap;
    }
}

