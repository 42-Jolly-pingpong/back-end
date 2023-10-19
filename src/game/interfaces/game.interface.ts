import { Ball } from "./Ball.interface";
import { Paddle } from "./paddle.interface";

export interface Game {
	ball: Ball,
	paddle1: Paddle,
	paddle2: Paddle,
	turn: number,
	isOver: boolean,
}
