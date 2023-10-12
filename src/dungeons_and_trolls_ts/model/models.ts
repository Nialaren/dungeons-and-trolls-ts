import localVarRequest from 'request';

export * from './dungeonsandtrollsAttributes';
export * from './dungeonsandtrollsAvailableLevels';
export * from './dungeonsandtrollsCharacter';
export * from './dungeonsandtrollsCommandsBatch';
export * from './dungeonsandtrollsCommandsForMonsters';
export * from './dungeonsandtrollsCoordinates';
export * from './dungeonsandtrollsDamageType';
export * from './dungeonsandtrollsDecoration';
export * from './dungeonsandtrollsDroppable';
export * from './dungeonsandtrollsEffect';
export * from './dungeonsandtrollsEvent';
export * from './dungeonsandtrollsEventType';
export * from './dungeonsandtrollsFogOfWarMap';
export * from './dungeonsandtrollsGameState';
export * from './dungeonsandtrollsIdentifier';
export * from './dungeonsandtrollsIdentifiers';
export * from './dungeonsandtrollsItem';
export * from './dungeonsandtrollsItemType';
export * from './dungeonsandtrollsKey';
export * from './dungeonsandtrollsLevel';
export * from './dungeonsandtrollsMap';
export * from './dungeonsandtrollsMapObjects';
export * from './dungeonsandtrollsMessage';
export * from './dungeonsandtrollsMonster';
export * from './dungeonsandtrollsPlayerSpecificMap';
export * from './dungeonsandtrollsPlayersInfo';
export * from './dungeonsandtrollsPosition';
export * from './dungeonsandtrollsRegistration';
export * from './dungeonsandtrollsSimpleItem';
export * from './dungeonsandtrollsSkill';
export * from './dungeonsandtrollsSkillAttributes';
export * from './dungeonsandtrollsSkillEffect';
export * from './dungeonsandtrollsSkillGenericFlags';
export * from './dungeonsandtrollsSkillSpecificFlags';
export * from './dungeonsandtrollsSkillUse';
export * from './dungeonsandtrollsStun';
export * from './dungeonsandtrollsUser';
export * from './dungeonsandtrollsWaypoint';
export * from './protobufAny';
export * from './rpcStatus';
export * from './skillTarget';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { DungeonsandtrollsAttributes } from './dungeonsandtrollsAttributes';
import { DungeonsandtrollsAvailableLevels } from './dungeonsandtrollsAvailableLevels';
import { DungeonsandtrollsCharacter } from './dungeonsandtrollsCharacter';
import { DungeonsandtrollsCommandsBatch } from './dungeonsandtrollsCommandsBatch';
import { DungeonsandtrollsCommandsForMonsters } from './dungeonsandtrollsCommandsForMonsters';
import { DungeonsandtrollsCoordinates } from './dungeonsandtrollsCoordinates';
import { DungeonsandtrollsDamageType } from './dungeonsandtrollsDamageType';
import { DungeonsandtrollsDecoration } from './dungeonsandtrollsDecoration';
import { DungeonsandtrollsDroppable } from './dungeonsandtrollsDroppable';
import { DungeonsandtrollsEffect } from './dungeonsandtrollsEffect';
import { DungeonsandtrollsEvent } from './dungeonsandtrollsEvent';
import { DungeonsandtrollsEventType } from './dungeonsandtrollsEventType';
import { DungeonsandtrollsFogOfWarMap } from './dungeonsandtrollsFogOfWarMap';
import { DungeonsandtrollsGameState } from './dungeonsandtrollsGameState';
import { DungeonsandtrollsIdentifier } from './dungeonsandtrollsIdentifier';
import { DungeonsandtrollsIdentifiers } from './dungeonsandtrollsIdentifiers';
import { DungeonsandtrollsItem } from './dungeonsandtrollsItem';
import { DungeonsandtrollsItemType } from './dungeonsandtrollsItemType';
import { DungeonsandtrollsKey } from './dungeonsandtrollsKey';
import { DungeonsandtrollsLevel } from './dungeonsandtrollsLevel';
import { DungeonsandtrollsMap } from './dungeonsandtrollsMap';
import { DungeonsandtrollsMapObjects } from './dungeonsandtrollsMapObjects';
import { DungeonsandtrollsMessage } from './dungeonsandtrollsMessage';
import { DungeonsandtrollsMonster } from './dungeonsandtrollsMonster';
import { DungeonsandtrollsPlayerSpecificMap } from './dungeonsandtrollsPlayerSpecificMap';
import { DungeonsandtrollsPlayersInfo } from './dungeonsandtrollsPlayersInfo';
import { DungeonsandtrollsPosition } from './dungeonsandtrollsPosition';
import { DungeonsandtrollsRegistration } from './dungeonsandtrollsRegistration';
import { DungeonsandtrollsSimpleItem } from './dungeonsandtrollsSimpleItem';
import { DungeonsandtrollsSkill } from './dungeonsandtrollsSkill';
import { DungeonsandtrollsSkillAttributes } from './dungeonsandtrollsSkillAttributes';
import { DungeonsandtrollsSkillEffect } from './dungeonsandtrollsSkillEffect';
import { DungeonsandtrollsSkillGenericFlags } from './dungeonsandtrollsSkillGenericFlags';
import { DungeonsandtrollsSkillSpecificFlags } from './dungeonsandtrollsSkillSpecificFlags';
import { DungeonsandtrollsSkillUse } from './dungeonsandtrollsSkillUse';
import { DungeonsandtrollsStun } from './dungeonsandtrollsStun';
import { DungeonsandtrollsUser } from './dungeonsandtrollsUser';
import { DungeonsandtrollsWaypoint } from './dungeonsandtrollsWaypoint';
import { ProtobufAny } from './protobufAny';
import { RpcStatus } from './rpcStatus';
import { SkillTarget } from './skillTarget';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: {[index: string]: any} = {
        "DungeonsandtrollsDamageType": DungeonsandtrollsDamageType,
        "DungeonsandtrollsEventType": DungeonsandtrollsEventType,
        "DungeonsandtrollsItemType": DungeonsandtrollsItemType,
        "SkillTarget": SkillTarget,
}

let typeMap: {[index: string]: any} = {
    "DungeonsandtrollsAttributes": DungeonsandtrollsAttributes,
    "DungeonsandtrollsAvailableLevels": DungeonsandtrollsAvailableLevels,
    "DungeonsandtrollsCharacter": DungeonsandtrollsCharacter,
    "DungeonsandtrollsCommandsBatch": DungeonsandtrollsCommandsBatch,
    "DungeonsandtrollsCommandsForMonsters": DungeonsandtrollsCommandsForMonsters,
    "DungeonsandtrollsCoordinates": DungeonsandtrollsCoordinates,
    "DungeonsandtrollsDecoration": DungeonsandtrollsDecoration,
    "DungeonsandtrollsDroppable": DungeonsandtrollsDroppable,
    "DungeonsandtrollsEffect": DungeonsandtrollsEffect,
    "DungeonsandtrollsEvent": DungeonsandtrollsEvent,
    "DungeonsandtrollsFogOfWarMap": DungeonsandtrollsFogOfWarMap,
    "DungeonsandtrollsGameState": DungeonsandtrollsGameState,
    "DungeonsandtrollsIdentifier": DungeonsandtrollsIdentifier,
    "DungeonsandtrollsIdentifiers": DungeonsandtrollsIdentifiers,
    "DungeonsandtrollsItem": DungeonsandtrollsItem,
    "DungeonsandtrollsKey": DungeonsandtrollsKey,
    "DungeonsandtrollsLevel": DungeonsandtrollsLevel,
    "DungeonsandtrollsMap": DungeonsandtrollsMap,
    "DungeonsandtrollsMapObjects": DungeonsandtrollsMapObjects,
    "DungeonsandtrollsMessage": DungeonsandtrollsMessage,
    "DungeonsandtrollsMonster": DungeonsandtrollsMonster,
    "DungeonsandtrollsPlayerSpecificMap": DungeonsandtrollsPlayerSpecificMap,
    "DungeonsandtrollsPlayersInfo": DungeonsandtrollsPlayersInfo,
    "DungeonsandtrollsPosition": DungeonsandtrollsPosition,
    "DungeonsandtrollsRegistration": DungeonsandtrollsRegistration,
    "DungeonsandtrollsSimpleItem": DungeonsandtrollsSimpleItem,
    "DungeonsandtrollsSkill": DungeonsandtrollsSkill,
    "DungeonsandtrollsSkillAttributes": DungeonsandtrollsSkillAttributes,
    "DungeonsandtrollsSkillEffect": DungeonsandtrollsSkillEffect,
    "DungeonsandtrollsSkillGenericFlags": DungeonsandtrollsSkillGenericFlags,
    "DungeonsandtrollsSkillSpecificFlags": DungeonsandtrollsSkillSpecificFlags,
    "DungeonsandtrollsSkillUse": DungeonsandtrollsSkillUse,
    "DungeonsandtrollsStun": DungeonsandtrollsStun,
    "DungeonsandtrollsUser": DungeonsandtrollsUser,
    "DungeonsandtrollsWaypoint": DungeonsandtrollsWaypoint,
    "ProtobufAny": ProtobufAny,
    "RpcStatus": RpcStatus,
}

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if(typeMap[discriminatorType]){
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string) {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.serialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string) {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.deserialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap[type]) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): Promise<void> | void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class HttpBearerAuth implements Authentication {
    public accessToken: string | (() => string) = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            const accessToken = typeof this.accessToken === 'function'
                            ? this.accessToken()
                            : this.accessToken;
            requestOptions.headers["Authorization"] = "Bearer " + accessToken;
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        } else if (this.location == 'cookie' && requestOptions && requestOptions.headers) {
            if (requestOptions.headers['Cookie']) {
                requestOptions.headers['Cookie'] += '; ' + this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
            else {
                requestOptions.headers['Cookie'] = this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}

export type Interceptor = (requestOptions: localVarRequest.Options) => (Promise<void> | void);
