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
import { DIRECTION } from './enums/direction.enum';
import { initGame, update } from './gameUtils';
import { GameMode } from '../enums/game-mode.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistoryRepository } from '../repositories/game-history.repository';

@WebSocketGateway(4242, { namespace: `game`, cors: { origin: '* ' } })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@InjectRepository(GameHistoryRepository)
	private gameHistoryRepository: GameHistoryRepository;
	constructor() {}

	private speedQueue: number[] = [];
	private normalQueue: number[] = [];
	private gameRoomData: Map<string, Game> = new Map();
	private clientList: Map<number, Socket> = new Map();

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
	}

	handleDisconnect(client: Socket) {
		console.log(`클라이언트 연결 끊김 : ${client.id}`);
	}

	@SubscribeMessage('setId')
	handleEvent(client: Socket, id: number) {
		this.clientList.set(id, client);
	}

	@SubscribeMessage('speedMatching')
	SpeedGameMatching(client: Socket, id: number) {
		if (this.speedQueue.length < 1) {
			this.speedQueue.push(id);
		} else {
			const oppenentId: number = this.speedQueue.shift()
			const oppenentClient: Socket = this.clientList.get(oppenentId);
			const roomName: string = uuidv4();
			client.join(roomName);
			oppenentClient.join(roomName);
			this.gameRoomData.set(
				roomName,
				initGame(
					GameMode.SPEED,
					1,
					0,
					0,
					0,
					id,
					oppenentId
				)
			);
			const clinet1 = {
				roomName,
				position: 1,
				opponent: oppenentId,
			};
			const client2 = {
				roomName,
				position: 2,
				opponent: id,
			};
			client.emit('getPlayerInfo', clinet1);
			oppenentClient.emit('getPlayerInfo', client2);
			this.server.to(roomName).emit('gameStart');
		}
	}

	@SubscribeMessage('normalMatching')
	noramlGameMatching(client: Socket, id: number) {
		if (this.normalQueue.length < 1) {
			this.normalQueue.push(id);
		} else {
			const oppenentId: number = this.normalQueue.shift()
			const oppenentClient: Socket = this.clientList.get(oppenentId);
			const roomName: string = uuidv4();
			// 상대 클라이언트 소켓 접속 유무 확인하는 로직 필요
			client.join(roomName);
			oppenentClient.join(roomName);
			this.gameRoomData.set(
				roomName,
				initGame(
					GameMode.NORMAL,
					1,
					0,
					0,
					0,
					id,
					oppenentId
				)
			);
			const clinet1 = {
				roomName,
				position: 1,
				opponent: oppenentId,
			};
			const client2 = {
				roomName,
				position: 2,
				opponent: id,
			};
			client.emit('getPlayerInfo', clinet1);
			oppenentClient.emit('getPlayerInfo', client2);
			this.server.to(roomName).emit('gameStart');
		}
	}

	@SubscribeMessage('cancel')
	matchingCancel(client: Socket, id: string) {
		const normalIndex = this.normalQueue.indexOf(parseInt(id, 10));
		if (normalIndex !== -1) {
			this.normalQueue.splice(normalIndex, 1);
		}
		const speedIndex = this.speedQueue.indexOf(parseInt(id, 10));
		if (speedIndex !== -1) {
			this.speedQueue.splice(speedIndex, 1);
		}
	}

	@SubscribeMessage('getGameData')
	sendInitialPositions(client: Socket, roomName: string) {
		let curGame: Game = this.gameRoomData.get(roomName);
		if (curGame == undefined ||curGame.run)
			return ;
		curGame.run = true;
		this.gameRoomData.set(roomName, curGame);
		const intervalId: NodeJS.Timeout = setInterval(() => {
			let curGame: Game = this.gameRoomData.get(roomName);
			if (curGame === undefined) {
				clearInterval(intervalId);
				return;
			}
			if (curGame.isEnd) {
				this.gameRoomData.delete(roomName);
				this.gameHistoryRepository.gameHistorySave(curGame);
				this.server.to(roomName).emit('gameResult', curGame.winner);
				clearInterval(intervalId);
				return;
			}
			if (curGame.isOver) {
				curGame = initGame(
					curGame.mode,
					curGame.turn,
					curGame.round + 1,
					curGame.player1.score,
					curGame.player2.score,
					curGame.player1.id,
					curGame.player2.id
				);
				this.server
					.to(roomName)
					.emit(
						'getGameData',
						curGame.ball,
						curGame.player1,
						curGame.player2
					);
				this.server
					.to(roomName)
					.emit('waitRound', curGame.round, curGame.turn);
				curGame.isOver = false;
				this.gameRoomData.set(roomName, curGame);
				clearInterval(intervalId);
				return;
			}
			const updateGame = update(curGame);
			this.gameRoomData.set(roomName, updateGame);
			this.server
				.to(roomName)
				.emit(
					'getGameData',
					updateGame.ball,
					updateGame.player1,
					updateGame.player2
				);
		}, 1000 / 60); // 60 FPS
	}

	@SubscribeMessage('movePlayer')
	moveplayer(client: Socket, message: string) {
		const [roomName, player, key] = message;

		const game = this.gameRoomData.get(roomName);
		if (key === 'ArrowUp') {
			if (player == '1') game.player1.move = DIRECTION.UP;
			else game.player2.move = DIRECTION.UP;
		} else {
			if (player == '1') game.player1.move = DIRECTION.DOWN;
			else game.player2.move = DIRECTION.DOWN;
		}
		this.gameRoomData.set(roomName, game);
	}

	@SubscribeMessage('stopPlayer')
	stopplayer(client: Socket, message: string) {
		const [roomName, player, key] = message;

		const game = this.gameRoomData.get(roomName);
		if (key === 'ArrowUp' || key === 'ArrowDown') {
			if (player == '1') game.player1.move = DIRECTION.IDLE;
			else game.player2.move = DIRECTION.IDLE;
		}
		this.gameRoomData.set(roomName, game);
	}

	@SubscribeMessage('playerDesertion')
	ExitEvent(client: Socket, message: string) {
		const [roomName, position] = message;
		console.log(roomName, position)
		const game = this.gameRoomData.get(roomName);
		if (game != undefined && !game.isEnd) {
			if (position == '1')
				game.winner = 2;
			else
				game.winner = 1;
			game.isEnd = true;
			this.gameRoomData.set(roomName, game);
		}
	}

	@SubscribeMessage('GameEnd')
	endGameEvent(client: Socket, roomName: string) {
		client.emit('exitGame');
		this.server.to(roomName).emit('exitOpponent');
	}
}
