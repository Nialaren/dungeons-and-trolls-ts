import { DungeonsandtrollsMapObjects } from '../dungeons_and_trolls_ts/api';
import { IFullGameState } from '../types';

export function findStairs(state: IFullGameState): DungeonsandtrollsMapObjects | undefined {
    let level = state.map.levels![0];
	for (let obj of level.objects!) {
		if (obj.isStairs) {
			return obj;
        }
	}
    return;
}

export function findPortal(state: IFullGameState): DungeonsandtrollsMapObjects | undefined {
	let level = state.map.levels![0];
    let portalObject: DungeonsandtrollsMapObjects | undefined = undefined;

	for (let obj of level.objects!) {
		if (obj.portal) {
            if (
                !portalObject
                || (portalObject.portal?.destinationFloor || 0) < (obj.portal?.destinationFloor || 0)
            ) {
                portalObject = obj;
            }
        }
	}
	return portalObject;
}
