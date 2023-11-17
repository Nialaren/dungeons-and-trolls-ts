import fs from 'node:fs/promises';
import path from 'path';
import logger from '../logger';
import { DungeonsandtrollsItem } from 'src/dungeons_and_trolls_ts/api';
import { IFullGameState } from 'src/types';
import { estimateSkillValue } from './skill';

export async function printToLogDir(fileName: string, data: any) {
    const destinationPath = path.resolve(__dirname, '..', '..', 'logs', fileName);

    let dataBuffer = '';

    if (typeof data === 'string') {
        dataBuffer = data;
    } else {
        try {
            dataBuffer = JSON.stringify(data, undefined, 4);
        } catch (e) {
            logger.error(data, 'Cannot stringify data');
            return;
        }
    }

    try {
        await fs.writeFile(destinationPath, dataBuffer);
    } catch (error) {
        if (error) {
            logger.error(data, 'Cannot write itemsData');
        }
    }
}

export async function logBoughtItems(gameState: IFullGameState, items: DungeonsandtrollsItem[]) {
    const allRequirements: Record<string, any> = {};
    const allAttributes: Record<string, any> = {};

    if (items.length === 0) {
        return;
    }

    logger.info({
        items: items.reduce((acc, item) => {
            acc[item.slot!] = {
                name: item.name,
                skills: item.skills?.map((sk) => sk.name!).join(', '),
                skillsValue: item.skills?.map((sk) => {
                    if (sk!.damageAmount) {
                        return estimateSkillValue(sk!.damageAmount!, gameState.character.attributes!)
                    }
                    return 'unknown';
                }).join(', ')
            };
            return acc;
        }, {} as any),
    }, 'Buying items');

    items.forEach((item) => {
        const {
            requirements = {},
            attributes = {},
        } = item;

        Object.keys(requirements).forEach((requiremenKey) => {
            allRequirements[requiremenKey] = (allRequirements[requiremenKey] || 0) + (requirements[requiremenKey] || 0);
        });
        Object.keys(attributes).forEach((attributeKey) => {
            allAttributes[attributeKey] = (allAttributes[attributeKey] || 0) + (attributes[attributeKey] || 0);
        });
    });

    const logObject = {
        requirements: allRequirements,
        attributes: allAttributes,
        items,
    }

    printToLogDir('bought-items.json', logObject);
    // its async
    printCurrentShopItems(gameState.shopItems!);
}

export async function printCurrentShopItems(shopItems: DungeonsandtrollsItem[]) {
    // find 5 items with change
    // const itemsWithCharge = shopItems.filter((item) => {
    //     return item.skills?.some((skill) => skill.name!.toLowerCase().includes('charge')) || false;
    // });

    await printToLogDir('allItemsInShop.json', shopItems);

    // if (itemsWithCharge.length > 0) {
    //     await printToLogDir('allItemsInShop.json', itemsWithCharge);
    // }
}