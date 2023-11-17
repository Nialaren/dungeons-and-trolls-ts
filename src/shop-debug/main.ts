import fs from 'node:fs/promises';
import path from 'node:path';
import {
	DungeonsandtrollsAttributes,
	DungeonsandtrollsCharacter,
	type DungeonsandtrollsItem
} from '../dungeons_and_trolls_ts/api';
import { buyItems } from '../modules/shop';
import { calculateStats } from '../modules/item';
import logger from '../logger';

// const __dirname = fileURLToPath(import.meta.url);
const FILE = 'last-iteration-shop-data.json';
// const FILE = 'desktop-shop-data.json';

const testMoney = 2050;
const testAttributes = new DungeonsandtrollsAttributes();

async function dumpToFile(items: DungeonsandtrollsItem[]) {
    const logObject = {
        ...calculateStats(items),
        items,
    }

    await fs.writeFile(path.resolve(__dirname, 'logs', 'bought-items.json'), JSON.stringify(logObject));
}

async function main() {
	let shopItems: DungeonsandtrollsItem[] = [];

	try {
		const shopDataStr = (await fs.readFile(path.resolve(__dirname, 'data', FILE))).toString();
		shopItems = JSON.parse(shopDataStr);
	} catch (error) {
		logger.error(error);
		return process.exit(1);
	}

	const character = new DungeonsandtrollsCharacter();
	character.attributes = testAttributes;
	character.money = testMoney;


	console.time('shop');
	const itemsToBuy = await buyItems(
		shopItems,
		character,
	);
	console.timeEnd('shop');

	dumpToFile(itemsToBuy);
}


main();