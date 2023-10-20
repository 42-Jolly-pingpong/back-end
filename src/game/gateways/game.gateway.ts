import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Game } from '../interfaces/game.interface';
import { Ball } from '../interfaces/Ball.interface';
import { DIRECTION } from './enums/direction.enum';
import { Paddle } from '../interfaces/paddle.interface';
import { initGame, update } from './gameUtils';

@WebSocketGateway(4242, { namespace: `game`, cors: { origin: '* ' } })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor() {}

	private paddleHeight: number = 20;
	private paddleWidth: number = 2;
	private ballRadius: number = 10;
	private waitQueue: Socket[] = [];
	private gameRoomData: Map<string, Game> = new Map();

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('events')
	async handleMessage(@MessageBody() data: string): Promise<string> {
		return data;
	}

	afterInit(server: Server) {
		console.log('웹소켓 서버 초기화');
	}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`클라이언트 연결됨 : ${client.id}`);
		// this.clientList.set(client.id, client);
		// this.clientList.forEach((value, key) => {
		// 	console.log(`${key}: ${value.id}`);
		// });
		return null;
	}

	handleDisconnect(client: Socket) {
		console.log(`클라이언트 연결 끊김 : ${client.id}`);
		//	this.clientList.delete(client.id);
	}

	@SubscribeMessage('events')
	handleEvent(@MessageBody() data: string): string {
		console.log(data);
		return data;
	}

	@SubscribeMessage('matching')
	gameMatchgin(client: Socket) {
		if (this.waitQueue.length < 1) {
			console.log('매칭 등록');
			client.emit('gameMatching', 'success');
			this.waitQueue.push(client);
			this.waitQueue.forEach((client: Socket) => console.log(client.id));
		} else {
			const anotherClient: Socket = this.waitQueue.shift();
			const roomName: string = uuidv4();
			// 상대 클라이언트 소켓 접속 유무 확인하는 로직 필요
			client.join(roomName);
			anotherClient.join(roomName);
			const clinet1 = { roomName, position: 1 };
			const client2 = { roomName, position: 2 };
			client.emit('getPlayerInfo', clinet1);
			anotherClient.emit('getPlayerInfo', client2);
			this.server.to(roomName).emit('gameStart');
		}
	}

	@SubscribeMessage('cancel')
	matchingCancel(client: Socket) {
		const index = this.waitQueue.indexOf(client);
		if (index !== -1) {
			this.waitQueue.splice(index, 1);
			client.emit('matchingCancel', 'success');
			console.log('대기자 현황', this.waitQueue);
		}
	}

	// 게임 로직
	@SubscribeMessage('getGameData')
	sendInitialPositions(client: Socket, roomName: string) {
		console.log(roomName);
		// 서버에서 초기 위치 정보를 생성

		this.gameRoomData.set(roomName, initGame());
		setInterval(() => {
			// 공이 캔버스 경계와 충돌 확인
			const game: Game = update(this.gameRoomData.get(roomName));
			this.gameRoomData.set(roomName, game);
			this.server
				.to(roomName)
				.emit('getGameData', game.ball, game.paddle1, game.paddle2);
		}, 1000 / 60); // 60 FPS
	}

	@SubscribeMessage('movePaddle')
	async movePaddle(client: Socket, message: string) {
		const [roomName, player, key] = message;

		const game = this.gameRoomData.get(roomName);
		if (key === 'ArrowUp') {
			if (player == '1') game.paddle1.move = DIRECTION.UP;
			else game.paddle2.move = DIRECTION.UP;
		} else {
			if (player == '1') game.paddle1.move = DIRECTION.DOWN;
			else game.paddle2.move = DIRECTION.DOWN;
		}
		this.gameRoomData.set(roomName, game);
	}

	@SubscribeMessage('stopPaddle')
	async stopPaddle(client: Socket, message: string) {
		const [roomName, player, key] = message;

		const game = this.gameRoomData.get(roomName);
		if (key === 'ArrowUp' || key === 'ArrowDown') {
			if (player == '1') game.paddle1.move = DIRECTION.IDLE;
			else game.paddle2.move = DIRECTION.IDLE;
		}
		this.gameRoomData.set(roomName, game);
	}
}
