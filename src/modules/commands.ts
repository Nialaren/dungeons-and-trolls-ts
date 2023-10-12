import { DungeonsandtrollsMessage } from '../dungeons_and_trolls_ts/api';

export function createYellCommand(text: string) {
    const message = new DungeonsandtrollsMessage();
    message.text = text;
    return message;
}

