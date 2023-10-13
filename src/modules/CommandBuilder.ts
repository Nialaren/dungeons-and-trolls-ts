import logger from '../logger';
import {
    DungeonsAndTrollsApi,
    DungeonsandtrollsAttributes,
    DungeonsandtrollsCharacter,
    DungeonsandtrollsCommandsBatch,
    DungeonsandtrollsIdentifiers,
    DungeonsandtrollsItem,
    DungeonsandtrollsMonster,
    DungeonsandtrollsPosition,
    DungeonsandtrollsSkill,
    DungeonsandtrollsSkillUse,
    SkillTarget,
} from '../dungeons_and_trolls_ts/api';
import { IFullGameState } from '../types';
import { createYellCommand } from './commands';

export default class CommandBuilder {
    private _api: DungeonsAndTrollsApi;

    private _commandBatch: DungeonsandtrollsCommandsBatch;

    constructor(
        api: DungeonsAndTrollsApi,
    ) {
        this._api = api;
        this._commandBatch = new DungeonsandtrollsCommandsBatch();
    }

    useSkill(
        skill: DungeonsandtrollsSkill,
        position: DungeonsandtrollsPosition,
        target?: DungeonsandtrollsMonster | DungeonsandtrollsCharacter,
    ) {
        const skillName = skill.name!;
        logger.info(`using skill: ${skillName}`);
        
        
        const skillUse = new DungeonsandtrollsSkillUse();
        skillUse.skillId = skill.id;

        const skillTarget: SkillTarget = skill.target || SkillTarget.None;
        if (skillTarget == SkillTarget.Position) {
            skillUse.position = position;
        } else if (skillTarget == SkillTarget.Character && target) {
            skillUse.targetId = target.id!;
        }

        this._commandBatch.skill = skillUse;

        if (!this._commandBatch.yell) {
            this.yell(`${skillName}!`);
        }
        return this;
    }

    walkTo(position: DungeonsandtrollsPosition) {
        this._commandBatch.move = position;
        return this;
    }

    yell(text: string) {
        this._commandBatch.yell = createYellCommand(text);
        return this;
    }

    buyItems(items: DungeonsandtrollsItem[]) {
        const identifiers = new DungeonsandtrollsIdentifiers();
        identifiers.ids = items.map((item) => item.id!);;
        this._commandBatch.buy = identifiers;
        return this;
    }

    assignSkillPoints(skillPoints: Record<string, number>) {
        const attributes = new DungeonsandtrollsAttributes();
        Object.keys(skillPoints).forEach((skillName) => {
            attributes[skillName] = skillPoints[skillName];
        });
        this._commandBatch.assignSkillPoints = attributes;
        return this;
    }

    async exec() {
        try {
            await this._api.dungeonsAndTrollsCommands(this._commandBatch, false);
            
            return true;
        } catch (error) {
            if (error.err?.body?.message?.includes('satisfied')) {
                throw error;
            }
            logger.error(error);
            return false;
        }
    }

    static create(
        api: DungeonsAndTrollsApi,
    ) {
        return new CommandBuilder(api);
    }
}