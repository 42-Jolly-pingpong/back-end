import { DmDto } from './dto/dm.dto';
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
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { SetParticipantStatusDto } from 'src/chat/dto/set-participant-status.dto';
import { SetParticipantRoleDto } from 'src/chat/dto/set-participant-role.dto';
import { AddParticipantDto } from 'src/chat/dto/add-participant.dto';

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
		const { roomId } = createChatDto;

		const newChat = await this.chatService.createChat(userId, createChatDto);

		client.to(String(roomId)).emit('getNewChat', { newChat, roomId }); //temp 룸에 있는 사람들에게만 이벤트 가도록 수정
		client.emit('getNewChat', { newChat, roomId });
	}

	@SubscribeMessage('createNewDm')
	async createNewDm(client: Socket, getDmDto: GetDmDto): Promise<DmDto> {
		return await this.chatService.getDm(getDmDto);
	}

	@SubscribeMessage('participantLeave')
	async participantLeave(client: Socket, roomId: number): Promise<ChatRoomDto> {
		const userId = client.handshake.auth.userId; //temp

		const room = await this.chatService.deleteParticipant(roomId, userId);

		this.server.emit('updateChatRoom', room);

		return room;
	}

	@SubscribeMessage('manageParticipantRole')
	async manageParticipantRole(
		client: Socket,
		chatParticipantDto: SetParticipantRoleDto
	): Promise<void> {
		const room = await this.chatService.setParticipantRole(chatParticipantDto);

		this.server.emit('updateChatRoom', room);
	}

	@SubscribeMessage('manageParticipantStatus')
	async manageParticipantStatus(
		client: Socket,
		chatParticipantDto: SetParticipantStatusDto
	): Promise<void> {
		console.log('kick');
		const room = await this.chatService.setParticipantStatus(
			chatParticipantDto
		);

		this.server.emit('updateChatRoom', room);
	}

	@SubscribeMessage('inviteUser')
	async inviteUser(
		client: Socket,
		addParticipantDto: AddParticipantDto
	): Promise<void> {
		const room = await this.chatService.addParticipants(addParticipantDto);

		this.server.emit('updateChatRoom', room);
	}
}
