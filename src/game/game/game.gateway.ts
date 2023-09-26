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

@WebSocketGateway(4242, { namespace: `game`, cors: { origin: '* ' } })
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor() {}

	private clientList: Map<string, Socket> = new Map<string, Socket>();
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
		console.log(`Client Connected : ${client.id}`);
		this.clientList.set(client.id, client);
		this.clientList.forEach((value, key) => {
			console.log(`${key}: ${value}`);
		});
    return (null)
	}

	handleDisconnect(client: Socket) {
		console.log(`Client Disconnected : ${client.id}`);
		this.clientList.delete(client.id);
	}

	@SubscribeMessage('events')
	handleEvent(@MessageBody() data: string): string {
		console.log(data);
		return data;
	}

	@SubscribeMessage('game-matching')
	gameMatchgin(client: Socket) {
		if (this.waitQueue.length < 0) {
      this.waitQueue.push(client)
		}
    const anotherUser: Socket = this.waitQueue.shift()
	}
}
