import { Server, Socket } from 'socket.io';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway({
	namespace: 'chat',
	cors: {},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly chatService: ChatService) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket, ...args: any[]) {
		const userId = client.handshake.auth.userId; //temp
		const rooms = await this.chatService.inquireAllJoinedChatRooms(userId);

		if (client.disconnect) {
			rooms.map((room) => client.join(String(room.id)));
		}
		//status 수정
	}

	handleDisconnect(client: any) {
		console.log('Method not implemented.');
	}
}
