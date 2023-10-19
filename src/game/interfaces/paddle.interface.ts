import { DIRECTION } from "../gateways/enums/direction.enum";

export interface Paddle {
	width: number,
	height: number,
	x: number,
	y: number,
	score: number,
	move: DIRECTION,
	speed: number,
}