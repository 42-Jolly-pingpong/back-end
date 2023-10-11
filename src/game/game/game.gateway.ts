import { ConsoleLogger } from '@nestjs/common';
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

@WebSocketGateway(4242, { namespace: `game`, cors: { origin: '* ' } })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor() {}

	// 클라이언트의 정보를 보관해야할지 모르겠음
	// private clientList: Map<string, Socket> = new Map<string, Socket>();
	private waitQueue: Socket[] = [];

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
			this.waitQueue.forEach((client: Socket) => console.log(client.id))
		} else {
			console.log('game success')
			const anotherClient: Socket = this.waitQueue.shift();
			const roomName: string = uuidv4();
			// 상대 클라이언트 소켓 접속 유무 확인하는 로직 필요
			client.join(roomName);
			anotherClient.join(roomName);
			this.server.to(roomName).emit('gameStart');
		}
	}

	@SubscribeMessage('cancel')
	matchingCancel(client: Socket) {
		const index = this.waitQueue.indexOf(client);
		if (index !== -1) {
			this.waitQueue.splice(index, 1);
			client.emit('matchingCancel', 'success')
			console.log('대기자 현황', this.waitQueue);
		}
	}
}
