import { DungeonsandtrollsCoordinates, DungeonsandtrollsPosition } from './dungeons_and_trolls_ts/api';

export function coordsToPosition(coordinates: DungeonsandtrollsCoordinates): DungeonsandtrollsPosition {
    const position = new DungeonsandtrollsPosition();

    position.positionX = coordinates.positionX;
    position.positionY = coordinates.positionY;
    return position;
}