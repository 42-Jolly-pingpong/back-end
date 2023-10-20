import { Ball } from '../interfaces/Ball.interface';
import { Game } from '../interfaces/game.interface';
import { Paddle } from '../interfaces/paddle.interface';
import { DIRECTION } from './enums/direction.enum';

const canvasWidth = 1000;
const canvasHeight = 600;

export function initBall(): Ball {
	return {
		width: 13,
		height: 13,
		x: canvasWidth / 2,
		y: canvasHeight / 2,
		moveX: DIRECTION.IDLE,
		moveY: DIRECTION.IDLE,
		speed: 7,
	};
}

export function initPaddle(position: number): Paddle {
	return {
		width: 12,
		height: 100,
		x: position === 1 ? 70 : canvasWidth - 70 - 12,
		y: canvasHeight / 2,
		score: 0,
		move: DIRECTION.IDLE,
		speed: 8,
	};
}

export function initGame(): Game {
	return {
		ball: initBall(),
		paddle1: initPaddle(1),
		paddle2: initPaddle(2),
		turn: 1,
		isOver: true,
		isEnd: false,
	};
}

export function update(game: Game): Game {
	if (game.isOver === true) {
		game.ball = initBall();
		game.paddle1 = initPaddle(1);
		game.paddle2 = initPaddle(2);
		game.ball.moveX = game.turn === 1 ? DIRECTION.LEFT : DIRECTION.RIGHT;
		game.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][
			Math.round(Math.random())
		];
		game.ball.y = canvasHeight / 2;
		game.isOver = false;
	} else {
		if (game.ball.y <= 0) game.ball.moveY = DIRECTION.DOWN;
		if (game.ball.y >= canvasHeight - game.ball.height)
			game.ball.moveY = DIRECTION.UP;

		// 플레이어의 이동
		if (game.paddle1.move === DIRECTION.UP)
			game.paddle1.y -= game.paddle1.speed;
		else if (game.paddle1.move === DIRECTION.DOWN)
			game.paddle1.y += game.paddle1.speed;

		if (game.paddle2.move === DIRECTION.UP)
			game.paddle2.y -= game.paddle2.speed;
		else if (game.paddle2.move === DIRECTION.DOWN)
			game.paddle2.y += game.paddle2.speed;

		// 플레이어 캔버스 경계 충돌 확인
		if (game.paddle1.y <= 0) game.paddle1.y = 0;
		else if (game.paddle1.y >= canvasHeight - game.paddle1.height)
			game.paddle1.y = canvasHeight - game.paddle1.height;
		if (game.paddle2.y <= 0) game.paddle2.y = 0;
		else if (game.paddle2.y >= canvasHeight - game.paddle2.height)
			game.paddle2.y = canvasHeight - game.paddle2.height;

		// monY 및 moveX 값을 기반으로 의도한 방향으로 공을 이동합니다.
		if (game.ball.moveY === DIRECTION.UP)
			game.ball.y -= game.ball.speed / 1.5;
		else if (game.ball.moveY === DIRECTION.DOWN)
			game.ball.y += game.ball.speed / 1.5;
		if (game.ball.moveX === DIRECTION.LEFT) game.ball.x -= game.ball.speed;
		else if (game.ball.moveX === DIRECTION.RIGHT)
			game.ball.x += game.ball.speed;

		// 플레이어1과 볼 충돌 확인
		if (
			game.ball.x - game.ball.width <= game.paddle1.x &&
			game.ball.x >= game.paddle1.x - game.paddle1.width
		) {
			if (
				game.ball.y <= game.paddle1.y + game.paddle1.height &&
				game.ball.y + game.ball.height >= game.paddle1.y
			) {
				game.ball.x = game.paddle1.x + game.ball.width;
				game.ball.moveX = DIRECTION.RIGHT;
				game.ball.speed += 0.5;
			}
		}
		// 플레이어2와 볼 충돌 확인
		if (
			game.ball.x - game.ball.width <= game.paddle2.x &&
			game.ball.x >= game.paddle2.x - game.paddle2.width
		) {
			if (
				game.ball.y <= game.paddle2.y + game.paddle2.height &&
				game.ball.y + game.ball.height >= game.paddle2.y
			) {
				game.ball.x = game.paddle2.x - game.ball.width;
				game.ball.moveX = DIRECTION.LEFT;
				game.ball.speed += 0.5;
			}
		}

		// 게임 끝 확인
		if (game.ball.x <= 0) {
			game.isOver = true;
		}
		if (game.ball.x >= canvasWidth - game.ball.width) game.isOver = true;
	}
	return game;
}
