import {
    DungeonsandtrollsCharacter,
    DungeonsandtrollsMapObjects,
    DungeonsandtrollsPosition
} from '../dungeons_and_trolls_ts/api';
import { IFullGameState } from '../types';
import { USERNAME } from '../constants';
import logger from "../logger";
import * as events from "events";

export function isSamePosition(posA: DungeonsandtrollsPosition, posB: DungeonsandtrollsPosition) {
    return posA.positionX === posB.positionX && posA.positionY === posB.positionY;
}


export function isPositionReachable(state: IFullGameState, position: DungeonsandtrollsPosition) {
    return getPositionDistance(state, position) !== -1;
}

export function getPositionDistance(state: IFullGameState, position: DungeonsandtrollsPosition) {
    const currentLevelMap = state.map.levels![0].playerMap!;

    const place = currentLevelMap.find((place) => isSamePosition(place.position!, position));

    return place!.distance ?? -1;
}

export function isTileInLineofSight(state: IFullGameState, tile: DungeonsandtrollsMapObjects) {
    const currentLevelMap = state.map.levels![0].playerMap!;

    const playerSpecMapTile = currentLevelMap.find((place) => isSamePosition(place.position!, tile.position!));

    return playerSpecMapTile!.lineOfSight || false;
}

export function isMonsterOnTile(tile: DungeonsandtrollsMapObjects, exclude: string[] = []) {
    return tile.monsters && tile.monsters.filter((
        monster
    ) => {
        return !exclude.some((name) => monster.name!.toLowerCase().includes(name));
    }).length > 0;
}

export function playersOnCurrentLevel(state: IFullGameState) {
    const currentLevel = state.map.levels![0];

    const tilesWithPlayers = currentLevel.objects!.filter((obj) => obj.players && obj.players.length > 0);
    const players = tilesWithPlayers.map((tile) => tile.players).reduce((acc, current) => acc!.concat(current!), []) as DungeonsandtrollsCharacter[];

    return {
        players,
        tilesWithPlayers
    };
}

export function findExit(state: IFullGameState) {
    return state.map.levels![0].objects!.find((tile) => tile.isSpawn) || undefined;
}

export function isAnyMonsterInLineOfSight(state: IFullGameState) {
    const tilesWithMonsters = state.map.levels![0].objects!
        .filter((tile) => tile.monsters && tile.monsters.length > 0);

    if (tilesWithMonsters.length === 0) {
        return false;
    }

    return tilesWithMonsters.some((tile) => isTileInLineofSight(state, tile));
}

export function getPlayerOnLevel(gameState: IFullGameState, partialName: string) {
    const playersOnLevel = playersOnCurrentLevel(gameState).players;
    const targetPlayer = playersOnLevel.find((player) => {
        return player.name!.toLowerCase().includes(partialName);
    });
    return targetPlayer;
}

export function getDarikWillHealMe(gameState: IFullGameState) {
    return gameState.events
        .filter((event) => event.message?.includes('Will heal ' + USERNAME))
        .length > 0;
}