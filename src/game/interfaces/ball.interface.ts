import { DIRECTION } from "../gateways/enums/direction.enum";

export interface Ball {
	width: number,
	height: number,
	x: number,
	y: number,
	moveX: DIRECTION,
	moveY: DIRECTION,
	speed: number
}