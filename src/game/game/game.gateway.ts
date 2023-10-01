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

	@SubscribeMessage('matching')
	gameMatchgin(client: Socket) {
    console.log(this.waitQueue.length)
		if (this.waitQueue.length < 1) {
      this.waitQueue.push(client)
      console.log('대기자 현황', this.waitQueue.forEach(client => {client.id}))
		}
    else {
      const anotherClient: Socket = this.waitQueue.shift()
      const roomName: string = uuidv4()
      client.join(roomName)
      anotherClient.join(roomName)
      this.server.to(roomName).emit('roomTest', '들어와잇어요')
    }
	}

  @SubscribeMessage('cancel')
  matchingCancel(client: Socket) {
    const index = this.waitQueue.indexOf(client)
    if (index !== -1) {
      this.waitQueue.splice(index, 1)
      console.log('대기자 현황', this.waitQueue)
    }
  }
}
