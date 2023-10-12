import { DungeonsandtrollsMapObjects, DungeonsandtrollsMonster } from '../dungeons_and_trolls_ts/api';
import { IFullGameState } from '../types';
import { getPositionDistance, isMonsterOnTile } from './mapUtils';


export function findNearestMonster(
	state: IFullGameState,
): { tile: DungeonsandtrollsMapObjects, monster: DungeonsandtrollsMonster } | undefined {
	let level = state.map.levels?.[0]; // there is only one level now

	const tilesWithMonsters = level!.objects!
		.filter((tile) => isMonsterOnTile(tile, ['chest']) && getPositionDistance(state, tile.position!) !== -1);

	tilesWithMonsters.sort((a, b) => (
		getPositionDistance(state, a.position!) - getPositionDistance(state, b.position!)
	));

	
	const tile = tilesWithMonsters[0];
	if (!tile) {
		return;
	}
	return {
		tile,
		// with lowest health
		monster: tile.monsters!.reduce((monster, current) => {
			if (monster.lifePercentage! < current.lifePercentage!) {
				return monster;
			}
			return current;
		}),
	};
}