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
import { Game } from 'src/game/interfaces/game.interface';
import { DIRECTION } from './enums/direction.enum';
import { initGame, update } from './gameUtils';
import { GameMode } from '../enums/game-mode.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistoryRepository } from '../repositories/game-history.repository';
import { UserRepository } from 'src/user/user.repository';
import { UserStatus } from 'src/user/enums/user-status.enum';
import { InviteInfo } from 'src/game/interfaces/inviteInfo.interface';
import { UserDto } from 'src/user/dto/user.dto';

@WebSocketGateway(4242, { namespace: `game`, cors: { origin: '* ' } })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@InjectRepository(GameHistoryRepository)
	private gameHistoryRepository: GameHistoryRepository;
	@InjectRepository(UserRepository) private userRepository: UserRepository;
	constructor() {}

	private speedQueue: number[] = [];
	private normalQueue: number[] = [];
	private gameRoomData: Map<string, Game> = new Map();
	private clientListById: Map<number, Socket> = new Map();
	private clientListBySocekt: Map<Socket, number> = new Map();

	@WebSocketServer()
	server: Server;

	afterInit(server: Server) {
		console.log('웹소켓 서버 초기화');
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`클라이언트 연결됨 : ${client.id}`);
	}

	async handleDisconnect(client: Socket) {
		const userId: number = this.clientListBySocekt.get(client);
		await this.userRepository.updateUserStatus(userId, UserStatus.OFFLINE);
		this.clientListById.delete(userId);
		this.clientListBySocekt.delete(client);
		this.server.emit('reload');
		console.log('client 나감');
	}

	@SubscribeMessage('setClient')
	async handleEvent(client: Socket, id: number) {
		this.clientListById.set(id, client);
		this.clientListBySocekt.set(client, id);
		console.log(id)
		await this.userRepository.updateUserStatus(id, UserStatus.ONLINE);
		this.server.emit('reload');
	}

	@SubscribeMessage('speedMatching')
	async SpeedGameMatching(client: Socket, id: number) {
		if (this.speedQueue.length < 1) {
			this.speedQueue.push(id);
		} else {
			const oppenentId: number = this.speedQueue.shift();
			const oppenentClient: Socket = this.clientListById.get(oppenentId);
			const roomName: string = uuidv4();
			client.join(roomName);
			oppenentClient.join(roomName);
			this.gameRoomData.set(
				roomName,
				initGame(GameMode.SPEED, 1, 0, 0, 0, id, oppenentId, new Date())
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
			await this.userRepository.updateUserStatus(id, UserStatus.INGAME);
			await this.userRepository.updateUserStatus(
				oppenentId,
				UserStatus.INGAME
			);
			this.server.emit('reload');
			client.emit('getPlayerInfo', clinet1);
			oppenentClient.emit('getPlayerInfo', client2);
			this.server.to(roomName).emit('gameStart');
		}
	}

	@SubscribeMessage('normalMatching')
	async noramlGameMatching(client: Socket, id: number) {
		if (this.normalQueue.length < 1) {
			this.normalQueue.push(id);
		} else {
			const oppenentId: number = this.normalQueue.shift();
			const oppenentClient: Socket = this.clientListById.get(oppenentId);
			const roomName: string = uuidv4();
			// 상대 클라이언트 소켓 접속 유무 확인하는 로직 필요
			client.join(roomName);
			oppenentClient.join(roomName);
			this.gameRoomData.set(
				roomName,
				initGame(GameMode.NORMAL, 1, 0, 0, 0, id, oppenentId, new Date())
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
			await this.userRepository.updateUserStatus(id, UserStatus.INGAME);
			await this.userRepository.updateUserStatus(
				oppenentId,
				UserStatus.INGAME
			);
			this.server.emit('reload');
			console.log('abc')
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
		if (curGame == undefined || curGame.run) return;
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
					curGame.player2.id,
					curGame.startTime
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
		const game = this.gameRoomData.get(roomName);
		if (game != undefined && !game.isEnd) {
			if (position == '1') game.winner = 2;
			else game.winner = 1;
			game.isEnd = true;
			this.gameRoomData.set(roomName, game);
		}
	}

	@SubscribeMessage('GameEnd')
	endGameEvent(client: Socket, roomName: string) {
		client.emit('exitGame');
		this.server.to(roomName).emit('exitOpponent');
	}

	@SubscribeMessage('inviteGame')
	async inviteGame(client: Socket, message: string) {
		const inviteInfo: InviteInfo = JSON.parse(message);
		const user: UserDto = await this.userRepository.findUserById(
			this.clientListBySocekt.get(client)
		);
		const friend: Socket = this.clientListById.get(inviteInfo.user.id);
		friend.emit('inviteGame', user, inviteInfo.mode);
	}

	@SubscribeMessage('acceptInvite')
	async acceptInvite(client: Socket, id: number, mode: GameMode) {
		const oppenentId: number = id;
		const oppenentClient: Socket = this.clientListById.get(id);
		const clientId = this.clientListBySocekt.get(client);
		const roomName: string = uuidv4();
		console.log('player1 = ', clientId);
		console.log('player2 = ', oppenentId);
		// 상대 클라이언트 소켓 접속 유무 확인하는 로직 필요
		client.join(roomName);
		oppenentClient.join(roomName);
		this.gameRoomData.set(
			roomName,
			initGame(GameMode.NORMAL, 1, 0, 0, 0, clientId, oppenentId, new Date())
		);
		const clinet1 = {
			roomName,
			position: 1,
			opponent: oppenentId,
		};
		const client2 = {
			roomName,
			position: 2,
			opponent: clientId,
		};
		await this.userRepository.updateUserStatus(id, UserStatus.INGAME);
		await this.userRepository.updateUserStatus(
			oppenentId,
			UserStatus.INGAME
		);
		this.server.emit('reload');
		client.emit('getPlayerInfo', clinet1);
		oppenentClient.emit('getPlayerInfo', client2);
		this.server.to(roomName).emit('gameStart');
	}
}
