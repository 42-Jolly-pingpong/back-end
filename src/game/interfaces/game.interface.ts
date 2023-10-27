import { GameMode } from '../enums/game-mode.enum';
import { Ball } from './Ball.interface';
import { Player } from './player.interface';

export interface Game {
	mode: GameMode;
	ball: Ball;
	player1: Player;
	player2: Player;
	turn: number;
	isOver: boolean;
	isEnd: boolean;
	round: number;
	winner: number;
	run: boolean;
}
