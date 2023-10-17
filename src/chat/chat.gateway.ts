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
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';

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
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async sendChat(client: Socket, createChatDto: CreateChatDto): Promise<void> {
		const userId = client.handshake.auth.userId; //temp
		const { roomId } = createChatDto;
		const room = await this.chatService.getChatRoom(roomId);

		const newChat = await this.chatService.createChat(userId, createChatDto);

		if (room.roomType === ChatRoomType.DM) {
			this.server
				.to(String(roomId))
				.emit('getNewChatOnDm', { newChat, roomId });
			return;
		}
		this.server.to(String(roomId)).emit('getNewChat', { newChat, roomId });
	}

	@SubscribeMessage('createNewDm')
	@UsePipes(ValidationPipe)
	async createNewDm(
		client: Socket,
		getDmDto: GetDmDto
	): Promise<{ status: number; dm: DmDto | null }> {
		try {
			const dm = await this.chatService.getDm(getDmDto);

			this.server.emit('addNewDm', {
				dm: dm,
				userId: getDmDto.chatMate.id,
			});

			return { status: HttpStatus.OK, dm };
		} catch (e) {
			return { status: HttpStatus.NOT_FOUND, dm: null };
		}
	}

	@SubscribeMessage('participantLeave')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async participantLeave(
		client: Socket,
		data: { roomId: number }
	): Promise<{ status: number; chatRoom: ChatRoomDto | null }> {
		const userId = client.handshake.auth.userId; //temp

		try {
			const room = await this.chatService.deleteParticipant(
				data.roomId,
				userId
			);
			client.leave(String(data.roomId));
			this.server.to(String(data.roomId)).emit('updateChatRoom', room);
			return { status: HttpStatus.OK, chatRoom: room };
		} catch (e) {
			return { status: HttpStatus.NOT_FOUND, chatRoom: null };
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

			this.server
				.to(String(chatParticipantDto.roomId))
				.emit('updateChatRoom', room);

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

			this.server
				.to(String(chatParticipantDto.roomId))
				.emit('updateChatRoom', room);

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

		client.join(String(addParticipantDto.roomId));
		this.server
			.to(String(addParticipantDto.roomId))
			.emit('updateChatRoom', room);
		this.server.emit('addNewChatRoom', {
			chatRoom: room,
			userId: addParticipantDto.participants,
		});
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

			const newRoom = await this.chatService.getChatRoom(setChatRoomDto.roomId);
			this.server
				.to(String(setChatRoomDto.roomId))
				.emit('updateChatRoom', newRoom);
			this.server
				.to(String(setChatRoomDto.roomId))
				.emit('updateChatRoomOnList', newRoom);

			return HttpStatus.OK;
		} catch (e) {
			return HttpStatus.UNAUTHORIZED;
		}
	}

	@SubscribeMessage('createChatRoom')
	@UsePipes(ValidationPipe)
	async createChatRoom(
		client: Socket,
		createChatRoomDto: CreateChatRoomDto
	): Promise<{ status: number; chatRoom: ChatRoomDto | null }> {
		try {
			const room = await this.chatService.createChatRoom(createChatRoomDto);

			client.join(String(room.id));

			return { status: HttpStatus.OK, chatRoom: room };
		} catch (e) {
			return { status: HttpStatus.BAD_REQUEST, chatRoom: null };
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

			this.server.to(String(data.roomId)).emit('chatRoomDeleted', data.roomId);

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
	): Promise<{ status: number; chatRoom: ChatRoomDto | null }> {
		const userId = client.handshake.auth.userId; //temp

		try {
			const room = await this.chatService.addParticipant(
				userId,
				enterChatRoomDto
			);

			client.join(String(enterChatRoomDto.roomId));

			this.server
				.to(String(enterChatRoomDto.roomId))
				.emit('updateChatRoom', room);

			return { status: HttpStatus.OK, chatRoom: room };
		} catch (e) {
			return { status: HttpStatus.UNAUTHORIZED, chatRoom: null };
		}
	}

	@SubscribeMessage('requestJoin')
	@UseGuards(RoomGuard)
	async requestJoin(client: Socket, data: { roomId: number }): Promise<void> {
		client.join(String(data.roomId));
	}
}
