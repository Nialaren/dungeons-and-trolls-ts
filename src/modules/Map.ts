import { IFullGameState } from '../types';
import {
    findExit,
    getPositionDistance,
    isTileInLineofSight,
    playersOnCurrentLevel,
    isAnyMonsterInLineOfSight,
    getPlayerOnLevel,
} from './mapUtils';
import { DungeonsandtrollsMapObjects, DungeonsandtrollsPosition } from '../dungeons_and_trolls_ts/api';


export default class Map {
    private _game: IFullGameState;

    constructor(gameState: IFullGameState) {
        this._game = gameState
    }


    isPositionReachable(position: DungeonsandtrollsPosition) {
        return this.getPositionDistance(position) !== -1;
    }

    getPositionDistance(position: DungeonsandtrollsPosition) {
        return getPositionDistance(this._game, position);
    }

    isTileInLineofSight(tile: DungeonsandtrollsMapObjects) {
        return isTileInLineofSight(this._game, tile);
    }

    playersOnCurrentLevel() {
        return playersOnCurrentLevel(this._game);
    }

    findExit() {
        return findExit(this._game);
    }

    isAnyMonsterInLineOfSight() {
        return isAnyMonsterInLineOfSight(this._game);
    }

    getPlayerOnLevel(partialName: string) {
        return getPlayerOnLevel(this._game, partialName);
    }


    static getInstance(gameState: IFullGameState) {
        return new Map(gameState);
    }
}