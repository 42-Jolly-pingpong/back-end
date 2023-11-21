import { GameMode } from 'src/game/enums/game-mode.enum';
import { Ball } from 'src/game/interfaces/ball.interface';
import { DIRECTION } from 'src/game/gateways/enums/direction.enum';
import { Player } from 'src/game/interfaces/player.interface';
import { Game } from 'src/game/interfaces/game.interface';
import { ScoreLogRepository } from 'src/game/repositories/score-log.repository';

const canvasWidth = 1000;
const canvasHeight = 600;
const normalMaxScore: number = 6;
const speedMaxScore: number = 6;

export function initBall(turn: number, mode: GameMode): Ball {
	return {
		width: 13,
		height: 13,
		x: canvasWidth / 2,
		y: canvasHeight / 2,
		moveX: turn === 1 ? DIRECTION.LEFT : DIRECTION.RIGHT,
		moveY: [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())],
		speed: mode === GameMode.SPEED ? 8 : 5,
	};
}

export function initPlayer(
	position: number,
	score: number,
	id: number
): Player {
	return {
		id,
		width: 12,
		height: 100,
		x: position === 1 ? 70 : canvasWidth - 70 - 12,
		y: canvasHeight / 2,
		score: score,
		move: DIRECTION.IDLE,
		speed: 8,
	};
}

export function initGame(
	roomName: string,
	mode: GameMode,
	turn: number,
	round: number,
	leftPlayerScore: number,
	rightPlayerScore: number,
	leftPlayerId: number,
	rightPlayerId: number,
	startTime: Date
): Game {
	return {
		roomName: roomName,
		mode: mode,
		ball: initBall(turn, mode),
		player1: initPlayer(1, leftPlayerScore, leftPlayerId),
		player2: initPlayer(2, rightPlayerScore, rightPlayerId),
		turn,
		isOver: true,
		isEnd: false,
		round,
		winner: 0,
		run: false,
		startTime: startTime,
	};
}

export function update(
	game: Game,
	scoreLogRepository: ScoreLogRepository
): Game {
	if (game.ball.y <= 0) game.ball.moveY = DIRECTION.DOWN;
	if (game.ball.y >= canvasHeight - game.ball.height)
		game.ball.moveY = DIRECTION.UP;

	// 플레이어의 이동
	if (game.player1.move === DIRECTION.UP)
		game.player1.y -= game.player1.speed;
	else if (game.player1.move === DIRECTION.DOWN)
		game.player1.y += game.player1.speed;

	if (game.player2.move === DIRECTION.UP)
		game.player2.y -= game.player2.speed;
	else if (game.player2.move === DIRECTION.DOWN)
		game.player2.y += game.player2.speed;

	// 플레이어 캔버스 경계 충돌 확인
	if (game.player1.y <= 0) game.player1.y = 0;
	else if (game.player1.y >= canvasHeight - game.player1.height)
		game.player1.y = canvasHeight - game.player1.height;
	if (game.player2.y <= 0) game.player2.y = 0;
	else if (game.player2.y >= canvasHeight - game.player2.height)
		game.player2.y = canvasHeight - game.player2.height;

	// monY 및 moveX 값을 기반으로 의도한 방향으로 공을 이동합니다.
	if (game.ball.moveY === DIRECTION.UP) game.ball.y -= game.ball.speed / 1.5;
	else if (game.ball.moveY === DIRECTION.DOWN)
		game.ball.y += game.ball.speed / 1.5;
	if (game.ball.moveX === DIRECTION.LEFT) game.ball.x -= game.ball.speed;
	else if (game.ball.moveX === DIRECTION.RIGHT)
		game.ball.x += game.ball.speed;

	// 플레이어1과 볼 충돌 확인
	if (
		game.ball.x - game.ball.width <= game.player1.x &&
		game.ball.x >= game.player1.x - game.player1.width
	) {
		if (
			game.ball.y <= game.player1.y + game.player1.height &&
			game.ball.y + game.ball.height >= game.player1.y
		) {
			game.ball.x = game.player1.x + game.ball.width;
			game.ball.moveX = DIRECTION.RIGHT;
			if (game.mode == GameMode.NORMAL) game.ball.speed += 0.5;
			else game.ball.speed += 1.5;
		}
	}
	// 플레이어2와 볼 충돌 확인
	if (
		game.ball.x - game.ball.width <= game.player2.x &&
		game.ball.x >= game.player2.x - game.player2.width
	) {
		if (
			game.ball.y <= game.player2.y + game.player2.height &&
			game.ball.y + game.ball.height >= game.player2.y
		) {
			game.ball.x = game.player2.x - game.ball.width;
			game.ball.moveX = DIRECTION.LEFT;
			if (game.mode == GameMode.NORMAL) game.ball.speed += 0.5;
			else game.ball.speed += 1.5;
		}
	}

	// 게임 끝 확인
	if (game.ball.x <= 0) {
		game.turn = 2;
		game.isOver = true;
		game.player2.score += 1;
		scoreLogRepository.saveScoreLog(
			game.roomName,
			game.startTime,
			game.player2.id
		);
	}
	if (game.ball.x >= canvasWidth - game.ball.width) {
		game.isOver = true;
		game.turn = 1;
		game.player1.score += 1;
		scoreLogRepository.saveScoreLog(
			game.roomName,
			game.startTime,
			game.player1.id
		);
	}

	if (game.mode == GameMode.NORMAL) {
		if (
			game.player1.score == normalMaxScore ||
			game.player2.score == normalMaxScore
		) {
			game.isEnd = true;
			if (game.player1.score == normalMaxScore) game.winner = 1;
			else game.winner = 2;
		}
	} else {
		if (
			game.player1.score == speedMaxScore ||
			game.player2.score == speedMaxScore
		) {
			game.isEnd = true;
			if (game.player1.score == speedMaxScore) game.winner = 1;
			else game.winner = 2;
		}
	}

	return game;
}
