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
import { DungeonsandtrollsPosition } from './dungeonsandtrollsPosition';

export class DungeonsandtrollsPlayerSpecificMap {
    'position'?: DungeonsandtrollsPosition;
    'distance'?: number;
    'lineOfSight'?: boolean;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "position",
            "baseName": "position",
            "type": "DungeonsandtrollsPosition"
        },
        {
            "name": "distance",
            "baseName": "distance",
            "type": "number"
        },
        {
            "name": "lineOfSight",
            "baseName": "lineOfSight",
            "type": "boolean"
        }    ];

    static getAttributeTypeMap() {
        return DungeonsandtrollsPlayerSpecificMap.attributeTypeMap;
    }
}

