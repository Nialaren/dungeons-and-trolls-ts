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
import { DungeonsandtrollsCharacter } from './dungeonsandtrollsCharacter';
import { DungeonsandtrollsEvent } from './dungeonsandtrollsEvent';
import { DungeonsandtrollsItem } from './dungeonsandtrollsItem';
import { DungeonsandtrollsMap } from './dungeonsandtrollsMap';
import { DungeonsandtrollsPosition } from './dungeonsandtrollsPosition';

export class DungeonsandtrollsGameState {
    'map'?: DungeonsandtrollsMap;
    'shopItems'?: Array<DungeonsandtrollsItem>;
    'character'?: DungeonsandtrollsCharacter;
    'currentPosition'?: DungeonsandtrollsPosition;
    'currentLevel'?: number | null;
    'tick'?: number;
    /**
    * List of events which occurred in the previous tick. Useful for visualising effects, debugging and communication.
    */
    'events'?: Array<DungeonsandtrollsEvent>;
    'score'?: number;
    'maxLevel'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "map",
            "baseName": "map",
            "type": "DungeonsandtrollsMap"
        },
        {
            "name": "shopItems",
            "baseName": "shopItems",
            "type": "Array<DungeonsandtrollsItem>"
        },
        {
            "name": "character",
            "baseName": "character",
            "type": "DungeonsandtrollsCharacter"
        },
        {
            "name": "currentPosition",
            "baseName": "currentPosition",
            "type": "DungeonsandtrollsPosition"
        },
        {
            "name": "currentLevel",
            "baseName": "currentLevel",
            "type": "number"
        },
        {
            "name": "tick",
            "baseName": "tick",
            "type": "number"
        },
        {
            "name": "events",
            "baseName": "events",
            "type": "Array<DungeonsandtrollsEvent>"
        },
        {
            "name": "score",
            "baseName": "score",
            "type": "number"
        },
        {
            "name": "maxLevel",
            "baseName": "maxLevel",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return DungeonsandtrollsGameState.attributeTypeMap;
    }
}
