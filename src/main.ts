
import { API_KEY, IP_ADDRESS } from './constants';
import { DungeonsAndTrollsApi, DungeonsAndTrollsApiApiKeys } from './dungeons_and_trolls_ts/api/dungeonsAndTrollsApi';
import { type DungeonsandtrollsGameState, DungeonsandtrollsPosition, DungeonsandtrollsAttributes, DungeonsandtrollsSkill, SkillTarget, DungeonsandtrollsItemType, DungeonsandtrollsIdentifiers, DungeonsandtrollsSkillUse, DungeonsandtrollsMapObjects, DungeonsandtrollsCharacter, DungeonsandtrollsItem } from './dungeons_and_trolls_ts/model/models';
import { type IFullGameState } from './types';
import logger from './logger';
import { buyItems, isShoppingTime } from './modules/shop';
import { findPortal, findStairs } from './modules/movement';
import Character from './modules/Character';
import { findNearestMonster } from './modules/monster';
import { logBoughtItems, printToLogDir } from './modules/debug';
import { getPlayerOnLevel } from './modules/mapUtils';
import { coordsToPosition } from './utils';
import CommandBuilder from './modules/CommandBuilder';
import { attackSkillBestMultiplier } from './modules/skill';
import Map from './modules/Map';

const apiInstance = new DungeonsAndTrollsApi(`http://${IP_ADDRESS}`);
apiInstance.setApiKey(DungeonsAndTrollsApiApiKeys.ApiKeyAuth, API_KEY)


let _gameState: DungeonsandtrollsGameState = {};

function getState(): IFullGameState {
    if (!_gameState || !_gameState.map) {
        throw new Error('Missing game state');
    }
    return _gameState as IFullGameState;
}

async function fetchGameState() {
	// logger.info("fetching game state");
    try {
        const { body } = await apiInstance.dungeonsAndTrollsGame(true, true);
        _gameState = body;
    } catch(error) {
        try {
			var j = JSON.parse(error.response.text);
			logger.error("***** failure: " + j.message);
		} catch (e) {
			logger.error(error);
		}
        return false;
    }
    return true;
};

const resistSkills = [
	'slashResist',
    'pierceResist',
    'fireResist',
]

async function spendSkillPoints({ character }: IFullGameState, attackSkill: DungeonsandtrollsSkill, commandBuilder: CommandBuilder) {
	logger.info("spending skill points");
	let bestMultiplierStat = 'life';
	if (attackSkill) {
		bestMultiplierStat = attackSkillBestMultiplier(attackSkill);
	}

	const characterAttributes = character.attributes!;

	const bestAttrSkillPoints = Math.floor(character.skillPoints! / 2);
	const resistSkillPoints = character.skillPoints! - bestAttrSkillPoints;

	const skillPointsMap = {
		[bestMultiplierStat]: bestAttrSkillPoints,
	};

	for (let i = 0; i < resistSkillPoints; i++) {
		let lowestSkillKey= resistSkills[0];
		let lowestValue = (characterAttributes[lowestSkillKey] || 0) + (skillPointsMap[lowestSkillKey] || 0);
		
		resistSkills.forEach((skillKey) => {
			const value = (characterAttributes[skillKey] || 0) + (skillPointsMap[skillKey] || 0);
			if (value < lowestValue) {
				lowestValue = value;
				lowestSkillKey = skillKey;
			}
		});

		skillPointsMap[lowestSkillKey] = (skillPointsMap[lowestSkillKey] || 0) + 1;
	}

	commandBuilder.assignSkillPoints({
		[bestMultiplierStat]: bestAttrSkillPoints,
	});
};

async function respawn() {
	logger.info('respawning');
	return apiInstance.dungeonsAndTrollsRespawn({
		key: API_KEY
	}, true);
}

function printStats(characterInstance: Character) {
	printToLogDir('stats.json', {
		attackSkill: characterInstance.attackSkill?.name,
		attackSkillDmg: characterInstance.attackSkillDmg,
		restSkill: characterInstance.restSkill?.name,
		restSkillValue: characterInstance.restSkillValue,
		money: characterInstance.money(),
		attributes: characterInstance.attributes(),
		maxAttributes: characterInstance.maxAttributes(),
		skills: characterInstance.currentSkills(),
		items: characterInstance.equip()
	});
}

const isExamining = false;
const shouldRespawn = false;

function examinePosition(state: IFullGameState) {
	// return false;

	if (isExamining) {
		const {
			currentLevel,
			character,
			map
		} = state;

		if (shouldRespawn && currentLevel !== 0) {
			respawn();
		} else {
			// logger.debug(map.levels![0].objects);
		}
		return true;
	}
	return false;
}

let firstRun = true;

async function timerLoop() {
	logger.info("----------");
    const success = await fetchGameState();

    if (!success) {
        setTimeout(timerLoop, 1000);
        return;
    }

	async function planAction() {
		try {
			const gameState = getState();
			const {
				currentLevel,
				character,
				currentPosition,
			} = gameState;

			if (examinePosition(gameState)) {
				if (currentLevel === 0) {
					logger.info('ZERO LEVEL');
					
					if (isShoppingTime(currentLevel || 0, character)) {
						logger.info('SHOPPING TIME!');
						const itemsToBuy = await buyItems(
							gameState.shopItems!,
							character,
						);
						// commandBuilder.buyItems(itemsToBuy);
						// log
						logBoughtItems(gameState, itemsToBuy);
					}
				}
				return;
			}

			const commandBuilder = CommandBuilder.create(apiInstance);

			const map = new Map(gameState);
			const charactedInstance = new Character(
				gameState,
				commandBuilder,
				map,
			);
	
			logger.info(`Tick ${gameState.tick}; lvl: ${currentLevel}[${currentPosition?.positionX},${currentPosition?.positionY}]`);
			logger.info(`Life: ${character.attributes?.life}, mana: ${character.attributes?.mana}, stamina: ${character.attributes?.stamina}`);

			// ZERO LEVEL
			if (currentLevel === 0) {
				logger.info('ZERO LEVEL');

				if ((gameState.map.levels![0].deprecationInSeconds || 1) < 23) {
					// wait for next tick.
					// Shop is long
					return;
				}
				
				let itemsToBuy: DungeonsandtrollsItem[] = [];
				if (isShoppingTime(currentLevel || 0, character)) {
					logger.info('SHOPPING TIME!');
					itemsToBuy = await buyItems(
						gameState.shopItems!,
						character,
					);
					commandBuilder.buyItems(itemsToBuy);
					// log
					logBoughtItems(gameState, itemsToBuy);
				}

				// Skill points
				if ((gameState.character.skillPoints || 0) > 0 && character.equip && character.equip.length > 2) {
					await spendSkillPoints(
						gameState,
						charactedInstance.attackSkill,
						commandBuilder,
					);
				}
				// save current items to log
				printStats(charactedInstance);

				// Movement
				const destitantionObj = findPortal(gameState) || findStairs(gameState);
				
				if (destitantionObj) {
					// also make exec
					try {
						await charactedInstance.walkToTile(destitantionObj);
					} catch (err) {
						if (err?.body?.message?.includes('satisfied')) {
							printToLogDir('failed-to-buy.json', itemsToBuy);
						}
						return;
					}
					return;
				}
				return;
			}

			if (firstRun) {
				firstRun = false;
				logger.debug({
					restSkill: charactedInstance.restSkill?.name,
					attackSkill: charactedInstance.attackSkill.name,
					maxLife: character.maxAttributes!.life,
				});
				printStats(charactedInstance);
			}

			const percentLife = charactedInstance.percentLife();
			const isOnExitTile = charactedInstance.isOnExitTile();
			const nearestMonster = findNearestMonster(gameState);
			const stairsTile = findStairs(gameState)!;
			const stairsDistance = map.getPositionDistance(stairsTile.position!);

			const darik = getPlayerOnLevel(gameState, 'darik');
			let hasDarikHeal = false;

			if (darik) {
				// check his skills
				hasDarikHeal = (darik.equip || []).some((item) => {
					return item.skills && item.skills.some((skill) => {
						return skill.name?.toLowerCase().includes('patch');
					});
				});
				logger.debug(`Darik has heal ${hasDarikHeal}`);
			}

			// There is no monster => go to stairs and wait
			if (!nearestMonster) {
				// check if we should wait
				if (stairsDistance <= 1 && currentLevel !== 0) {
					const playersData = map.playersOnCurrentLevel();

					if (playersData.length > 0) {
						let maxDist = 0;
						let maxPlayer: DungeonsandtrollsCharacter | undefined;

						playersData.filter((playerData) => playerData.distance <= 10).forEach((playerData) => {
							const {
								player,
								distance,
							} = playerData;

							if (player.id! === gameState.character.id!) {
								return;
							}
							if (distance > maxDist) {
								maxDist = distance;
								maxPlayer = player;
							}
						});

						if (maxDist > 1) {
							logger.info(`Waiting for ${maxPlayer!.name}`);
							await charactedInstance
								.commads()
								.yell(`Move your lazy ass! ${maxPlayer!.name}`)
								.walkTo(gameState.currentPosition)
								.exec();
							return;
						}
					}
				}
				// run towards stairs
				await charactedInstance.walkToTile(stairsTile!);
				return;
			}

			if (percentLife < 80) {
				if (charactedInstance.isInSafePlace() && darik && hasDarikHeal) {
					const distanceFromPlayer = map.getPositionDistance(
						coordsToPosition(darik.coordinates!),
					);

					if (distanceFromPlayer <= 1) {
						if (charactedInstance.canRest()) {
							await charactedInstance.tryRest();
						} else {
							await charactedInstance.waitOnPlace();
						}
						return;
					} else if (distanceFromPlayer > 1) {
						await charactedInstance.runToPlayer(darik);
						return;
					}
				}

				// Danger zone
				if (
					percentLife < 40
					|| (charactedInstance.percentStamina() < 10 && !charactedInstance.canRest())
				) {
					if (isOnExitTile) {
						if (charactedInstance.canRest()) {
							await charactedInstance.tryRest();
						} else {
							await charactedInstance.yell('Wating for darik!');
							return;
						}
					} else {
						if (darik && hasDarikHeal) {
							await charactedInstance.runToPlayer(darik);
							return;
						}
						if (!charactedInstance.isInSafePlace()) {
							await charactedInstance.runToExit();;
							return;
						}
						if (charactedInstance.canRest()) {
							await charactedInstance.tryRest();
							return;
						}
	
						const stairs = findStairs(gameState)!;
						await charactedInstance.walkToTile(stairs);
					}
					return;
				}
			}

			const { tile, monster } = nearestMonster;
			if (await charactedInstance.tryRest(tile)) {
				// resting
				return;
			}
			
			if (charactedInstance.isMonsterInLineOfSight(tile)) {
				if (charactedInstance.isMonsterInAttackRange(tile)) {
					const attackSuccess = await charactedInstance.attackMonster(tile, monster);
					if (!attackSuccess) {
						if (!await charactedInstance.runToExit()) {
							logger.debug('Failed to run awai');
							return;
						};
					} else {
						return;
					}
				} else if (charactedInstance.canChargeToMonster(tile)) {
					logger.debug('should charge to monster');
					await charactedInstance.chargeToMonster(tile, monster);
					return;
				}
			}
			// walk to monster
			await charactedInstance.walkToTile(tile);
		} catch (error) {
			logger.info(error, 'error')
		}
	}

	console.time('tick');
	await planAction();
	console.timeEnd('tick');

	setTimeout(timerLoop, 2);
};

setTimeout(timerLoop, 0);
