import { SetChatRoomDto } from './dto/set-chat-room.dto';
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
import { EnterChatRoomDto } from 'src/chat/dto/enter-chat-room.dto';
import {
	HttpStatus,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RoomGuard } from 'src/chat/guards/room.guard';

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
	@UsePipes(ValidationPipe)
	async sendChat(client: Socket, createChatDto: CreateChatDto): Promise<void> {
		const userId = client.handshake.auth.userId; //temp
		const { roomId } = createChatDto;

		const newChat = await this.chatService.createChat(userId, createChatDto);

		client.to(String(roomId)).emit('getNewChat', { newChat, roomId }); //temp 룸에 있는 사람들에게만 이벤트 가도록 수정
		client.emit('getNewChat', { newChat, roomId });
	}

	@SubscribeMessage('createNewDm')
	@UsePipes(ValidationPipe)
	async createNewDm(
		client: Socket,
		getDmDto: GetDmDto
	): Promise<{ response: number; dm: DmDto | null }> {
		try {
			const dm = await this.chatService.getDm(getDmDto);
			return { response: HttpStatus.OK, dm };
		} catch (e) {
			return { response: HttpStatus.NOT_FOUND, dm: null };
		}
	}

	@SubscribeMessage('participantLeave')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async participantLeave(
		client: Socket,
		data: { roomId: number }
	): Promise<{ response: number; chatRoom: ChatRoomDto | null }> {
		const userId = client.handshake.auth.userId; //temp

		try {
			const room = await this.chatService.deleteParticipant(
				data.roomId,
				userId
			);
			this.server.emit('updateChatRoom', room);

			return { response: HttpStatus.OK, chatRoom: room };
		} catch (e) {
			return { response: HttpStatus.NOT_FOUND, chatRoom: null };
		}
	}

	@SubscribeMessage('manageParticipantRole')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async manageParticipantRole(
		client: Socket,
		chatParticipantDto: SetParticipantRoleDto
	): Promise<number> {
		try {
			const room = await this.chatService.setParticipantRole(
				chatParticipantDto
			);

			this.server.emit('updateChatRoom', room);

			return HttpStatus.OK;
		} catch (e) {
			return HttpStatus.NOT_FOUND;
		}
	}

	@SubscribeMessage('manageParticipantStatus')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async manageParticipantStatus(
		client: Socket,
		chatParticipantDto: SetParticipantStatusDto
	): Promise<number> {
		try {
			const room = await this.chatService.setParticipantStatus(
				chatParticipantDto
			);

			this.server.emit('updateChatRoom', room);

			return HttpStatus.OK;
		} catch (e) {
			return HttpStatus.UNAUTHORIZED;
		}
	}

	@SubscribeMessage('inviteUser')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async inviteUser(
		client: Socket,
		addParticipantDto: AddParticipantDto
	): Promise<void> {
		const room = await this.chatService.addParticipants(addParticipantDto);

		this.server.emit('updateChatRoom', room);
	}

	@SubscribeMessage('setChatRoom')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async setChatRoom(
		client: Socket,
		setChatRoomDto: SetChatRoomDto
	): Promise<number> {
		const userId = client.handshake.auth.userId; //temp

		try {
			await this.chatService.setChatRoomInfo(userId, setChatRoomDto);

			this.server.emit(
				'updateChatRoom',
				await this.chatService.getChatRoom(setChatRoomDto.roomId)
			);

			return HttpStatus.OK;
		} catch (e) {
			return HttpStatus.UNAUTHORIZED;
		}
	}

	@SubscribeMessage('deleteChatRoom')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async deleteChatRoom(
		client: Socket,
		data: { roomId: number }
	): Promise<number> {
		const userId = client.handshake.auth.userId; //temp
		try {
			await this.chatService.deleteChatRoom(data.roomId, userId);

			this.server.emit('chatRoomDeleted', data.roomId);

			return HttpStatus.OK;
		} catch (e) {
			return HttpStatus.UNAUTHORIZED;
		}
	}

	@SubscribeMessage('enterChatRoom')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async enterChatRoom(
		client: Socket,
		enterChatRoomDto: EnterChatRoomDto
	): Promise<{ response: number; chatRoom: ChatRoomDto | null }> {
		const userId = client.handshake.auth.userId; //temp

		try {
			const room = await this.chatService.addParticipant(
				userId,
				enterChatRoomDto
			);
			this.server.emit('updateChatRoom', room);

			return { response: HttpStatus.OK, chatRoom: room };
		} catch (e) {
			return { response: HttpStatus.UNAUTHORIZED, chatRoom: null };
		}
	}
}
