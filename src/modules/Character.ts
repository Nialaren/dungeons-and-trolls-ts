import logger from '../logger';
import {
    DungeonsandtrollsCharacter,
    DungeonsandtrollsItem,
    DungeonsandtrollsItemType,
    DungeonsandtrollsMapObjects,
    DungeonsandtrollsMonster,
    DungeonsandtrollsPosition,
    DungeonsandtrollsSkill,
} from '../dungeons_and_trolls_ts/api';
import { IFullGameState } from '../types';
import {  evaluateParameters, evaluateAttributes } from './attributes';
import { isDamageSkill, estimateSkillValue as estimateSkillDamage, canUseSkill, isRestorationSkill, estimateRestorationSkillValue } from './skill';

import Map from './Map';
import CommandBuilder from './CommandBuilder';
import { coordsToPosition } from '../utils';
import { findNearestMonster } from './monster';
import { isSamePosition } from './mapUtils';


class Character {
    private _gameState: IFullGameState;
    private _character: DungeonsandtrollsCharacter;
    private _items: DungeonsandtrollsItem[];
    private _builder: CommandBuilder;
    private _map: Map;
    
    public items: Record<DungeonsandtrollsItemType, DungeonsandtrollsItem | undefined>;

    public skills: DungeonsandtrollsSkill[];

    public attackSkill: DungeonsandtrollsSkill;
    public attackSkillDmg: number;

    public damageSkills: DungeonsandtrollsSkill[];


    public restSkill: DungeonsandtrollsSkill | undefined;
    public restSkillValue: number;

    constructor(
        gameState: IFullGameState,
        commandBuilder: CommandBuilder,
        map: Map,
    ) {
        this._gameState = gameState;
        this._builder = commandBuilder;
        this._map = map;

        // init
        this.items = {};
        this.skills = [];
        this.damageSkills = [];
        this.restSkillValue = 0;
        this.attackSkillDmg = 0;

        // from data
        this._character = gameState.character!;
        this._items = this._character.equip!;

        // logger.debug(gameState.character)
        // logger.debug(this._character.equip)

        // items processing
        this._items.forEach((item) => {
            this.items[item.slot!] = item;

            // load skills
            if (item.skills && item.skills.length > 0) {
                item.skills.forEach((skill) => {
                    this.skills.push(skill);

                    if (isDamageSkill(skill)) {
                        const skillDmg = evaluateAttributes(skill.damageAmount!, this._character.attributes!);

                        this.damageSkills.push(skill);

                        if (!this.attackSkill) {
                            this.attackSkill = skill;
                            this.attackSkillDmg = skillDmg;
                        } else if (skillDmg > this.attackSkillDmg) {
                            // assaing new skill if there is better
                            this.attackSkill = skill;
                            this.attackSkillDmg = skillDmg;
                        }
                    }
                    
                    if (isRestorationSkill(skill)) {
                        const restSkillValue = estimateRestorationSkillValue(skill, this._character.attributes!);
                        if (!this.restSkill || restSkillValue > this.restSkillValue) {
                            this.restSkill = skill;
                            this.restSkillValue = restSkillValue;
                        }
                    }
                });
            }
        });
    }

    percentLife() {
        const lifeValue = this._character.attributes!.life || 0;
        const maxLifeValue = this._character.maxAttributes!.life || 0;

        return Math.floor((lifeValue / maxLifeValue) * 100);
    }

    percentStamina() {
        const staminaValue = this._character.attributes!.stamina || 0;
        const maxstaminaValue = this._character.maxAttributes!.stamina || 0;

        return Math.floor((staminaValue / maxstaminaValue) * 100);
    }

    money() {
        return this._character.money || 0;
    }

    attributes() {
        return this._character.attributes!;
    }

    maxAttributes() {
        return this._character.maxAttributes!;
    }

    equip() {
        return this._character.equip?.map((item) => ({
            ...item,
            skills: item.skills?.map((skill) => skill.name).join(', '),
        }));
    }

    currentSkills() {
        return this.skills;
    }

    hasPercentStamina(percentStamina: number = 30): boolean {
        return ((this._character.attributes?.stamina! / this._character.maxAttributes?.stamina!) * 100) >= percentStamina;
    }

    isMonsterInAttackRange(monsterTile: DungeonsandtrollsMapObjects) {
        const attackSkillRange = estimateSkillDamage(this.attackSkill.range!, this._character.attributes!);
        const monsterDistance = this._map.getPositionDistance(monsterTile.position!);

        return monsterDistance <= attackSkillRange;
    }

    isMonsterInLineOfSight(monsterTile: DungeonsandtrollsMapObjects) {
        return this._map.isTileInLineofSight(monsterTile);
    }

    canRest() {
        return !!this.restSkill
            && (this._character.lastDamageTaken || 0) > 3
            && this._character.attributes?.stamina! < this._character.maxAttributes?.stamina!
    }

    canChargeToMonster(tile: DungeonsandtrollsMapObjects) {
        const chargeSkill = this.skills.find((skill) => skill.name?.toLowerCase().includes('charge'));

        if (!chargeSkill || !canUseSkill(chargeSkill.cost!, this._character.attributes!)) {
            return false;
        }

        const chargeRange = Math.floor(evaluateParameters(chargeSkill.range!, this._character.attributes!));

        const targetDistance = this._map.getPositionDistance(tile.position!);

        return targetDistance <= chargeRange;
    }

    chooseAttackSkill(): DungeonsandtrollsSkill | undefined {
        if (canUseSkill(this.attackSkill.cost!, this._character.attributes!)) {
            return this.attackSkill;
        }
        return this.damageSkills.find((skill) => canUseSkill(skill.cost!, this._character.attributes!)) || undefined
    }

    isInSafePlace() {
        return !this._map.isAnyMonsterInLineOfSight()
            || (this._map.getPositionDistance(findNearestMonster(this._gameState)!.tile.position!)) > 6;
    }

    async waitOnPlace() {
        return this.walkTo(this._gameState.currentPosition);
    }

    async chargeToMonster(tile: DungeonsandtrollsMapObjects, monster: DungeonsandtrollsMonster) {
        const chargeSkill = this.skills.find((skill) => skill.name?.toLowerCase().includes('charge'));
        if (!chargeSkill) {
            return false;
        }
        logger.debug('Charge!');
        return this._builder
            .useSkill(chargeSkill, tile.position!, monster)
            .exec();
    }

    async attackMonster(tile: DungeonsandtrollsMapObjects, monster: DungeonsandtrollsMonster) {
        const attackSkillToUse = this.chooseAttackSkill();
       
        if (!attackSkillToUse) {
            logger.debug('Insuffisient attributes to use skill');
            return false;
        }

        logger.info(`Attacking: ${monster.name} (${monster.lifePercentage} %) EST: ${estimateSkillDamage(this.attackSkill.damageAmount!, this._character.attributes!)}`);

        return this._builder
            .useSkill(attackSkillToUse, tile.position!, monster)
            .exec();
    }

    async tryRest(nearestMonster?: DungeonsandtrollsMapObjects): Promise<boolean> {
        const restIsPossible = this.canRest();
        if (!restIsPossible) {
            return false;
        }

        if (
            nearestMonster
            && this.isMonsterInLineOfSight(nearestMonster)
            && (
                this.canChargeToMonster(nearestMonster)
                || this._map.getPositionDistance(nearestMonster.position!) < 5
            ) 
            && this.hasPercentStamina(40)
        ) {
            // FIGHT YOU LAZY
            return false;
        }
        return this._builder
            .useSkill(this.restSkill!, this._gameState.currentPosition, this._character!)
            .exec();
    }

    isOnExitTile() {
        const exitTile = this._map.findExit();
        return isSamePosition(exitTile!.position!, this._gameState.currentPosition);
    }

    async runToExit() {
        const exitTile = this._map.findExit();

        if (!exitTile) {
            return false;
        }

        this._builder.yell('Running away!');
        return this.walkToTile(exitTile);
    }

    async runToPlayer(player: DungeonsandtrollsCharacter) {
        this._builder.yell(`${player.name!} wait for me baby!`)
        return this.walkTo(coordsToPosition(player.coordinates!));
    }

    async walkTo(position: DungeonsandtrollsPosition) {
        logger.info(`Walking to: ${position.positionX}, ${position.positionY}`);
        return this._builder.walkTo(position).exec();
        // return this._api.dungeonsAndTrollsMove(position, false);
    }

    async walkToTile(tile: DungeonsandtrollsMapObjects) {
        const position = tile.position!;
        let targetInfo: string | undefined;
        let additionalInfo = '';

        if (tile.monsters && tile.monsters.length > 0) {
            targetInfo = tile.monsters![0].name!;
            additionalInfo = `, enemy(${targetInfo})`;
        } else if (tile.players && tile.players.length > 0) {
            targetInfo = tile.players[0].name!;
            additionalInfo = `, player(${targetInfo})`;
        } else if (tile.portal) {
            targetInfo = `portal(${tile.portal!.destinationFloor!})`
            additionalInfo = `, ${targetInfo}`;
        } else if (tile.isStairs) {
            targetInfo = 'stairs'
            additionalInfo = `, ${targetInfo}`;
        }
        logger.info(`Walking to: ${position.positionX}, ${position.positionY}${additionalInfo}`);

        return this._builder.walkTo(position).exec();
    }

    async yell(text: string) {
        return this._builder.yell(text).exec();
    }

    commads() {
        return this._builder;
    }
}

export default Character;
