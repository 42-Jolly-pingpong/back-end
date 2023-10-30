import { DIRECTION } from "src/game/gateways/enums/direction.enum";

export interface Player {
	id: number,
	width: number,
	height: number,
	x: number,
	y: number,
	score: number,
	move: DIRECTION,
	speed: number,
}