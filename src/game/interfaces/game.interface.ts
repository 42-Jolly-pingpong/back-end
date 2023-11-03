import { GameMode } from 'src/game/enums/game-mode.enum';
import { Ball } from 'src/game/interfaces/ball.interface';
import { Player } from 'src/game/interfaces/player.interface';

export interface Game {
	roomName: string;
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
	startTime: Date;
}
