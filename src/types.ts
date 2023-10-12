import { DungeonsAndTrollsApi, DungeonsAndTrollsApiApiKeys } from './dungeons_and_trolls_ts/api/dungeonsAndTrollsApi';
import { DungeonsandtrollsMonster, type DungeonsandtrollsGameState, DungeonsandtrollsPosition, DungeonsandtrollsAttributes, DungeonsandtrollsSkill, SkillTarget, DungeonsandtrollsItemType, DungeonsandtrollsIdentifiers, DungeonsandtrollsSkillUse } from './dungeons_and_trolls_ts/model/models';


export interface IFullGameState extends DungeonsandtrollsGameState {
    'map': NonNullable<DungeonsandtrollsGameState['map']>;
    'character':  NonNullable<DungeonsandtrollsGameState['character']>;
    'currentPosition':  NonNullable<DungeonsandtrollsGameState['currentPosition']>;
    'currentLevel': number | null;
    'tick': number;
    /**
    * List of events which occurred in the previous tick. Useful for visualising effects, debugging and communication.
    */
    'events': NonNullable<DungeonsandtrollsGameState['events']>;
    'score': number;
    'maxLevel': number;
}