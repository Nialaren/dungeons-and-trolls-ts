import { IFullGameState } from '../types';
import {
    findExit,
    getPositionDistance,
    isTileInLineofSight,
    playersOnCurrentLevel,
    isAnyMonsterInLineOfSight,
    getPlayerOnLevel,
} from './mapUtils';
import { DungeonsandtrollsCharacter, DungeonsandtrollsMapObjects, DungeonsandtrollsPosition } from '../dungeons_and_trolls_ts/api';

interface IPlayerTilePair {
    player: DungeonsandtrollsCharacter;
    tile: DungeonsandtrollsMapObjects;
}
interface IPlayerPositionInfo extends IPlayerTilePair {
    distance: number;
    isInLineOfSight;
}

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

    playersOnCurrentLevel(): IPlayerPositionInfo[] {
        const currentLevel = this._game.map.levels![0];
        const tilesWithPlayers = currentLevel.objects!.filter((obj) => obj.players && obj.players.length > 0);
        
        
        const playersInfo: IPlayerTilePair[] = tilesWithPlayers
            .map((tile) => tile.players!.map((player) => ({ player, tile })))
            .reduce((acc, current) => acc!.concat(current!), []);

        return playersInfo.map(({ player, tile }) => {
            return {
                player,
                tile,
                distance: this.getPositionDistance(tile.position!),
                isInLineOfSight: this.isTileInLineofSight(tile),
            };
        });
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