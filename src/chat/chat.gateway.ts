import { Server, Socket } from 'socket.io';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from 'src/chat/chat.service';
import { GetDmDto } from 'src/chat/dto/get-dm.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

@WebSocketGateway({
	namespace: 'chat',
	cors: {},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly chatService: ChatService) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket, ...args: any[]) {
		console.log('connected');
		const userId = client.handshake.auth.userId; //temp
		const rooms = await this.chatService.inquireAllJoinedChatRooms(userId);
		rooms.map((room) => client.join(String(room.id)));

		//status 수정
	}

	handleDisconnect(client: any) {
		console.log('Method not implemented.');
	}

	@SubscribeMessage('sendChat')
	async sendChat(client: Socket, createChatDto: CreateChatDto): Promise<void> {
		const userId = client.handshake.auth.userId; //temp
		const { content, roomId } = createChatDto;
		console.log(String(roomId), content, userId);

		const newChat = await this.chatService.createChat(userId, createChatDto);

		client.to(String(roomId)).emit('getNewChat', { newChat, roomId });
		client.emit('getNewChat', { newChat, roomId });
	}

}
