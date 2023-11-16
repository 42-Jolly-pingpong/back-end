import { SetChatRoomDto } from './dto/set-chat-room.dto';
import { DmDto } from './dto/dm.dto';
import { Server, Socket } from 'socket.io';
import {
	OnGatewayConnection,
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
	BadRequestException,
	HttpStatus,
	UnauthorizedException,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RoomGuard } from 'src/chat/guards/room.guard';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';

@WebSocketGateway({
	namespace: 'chat',
	cors: {},
})
export class ChatGateway implements OnGatewayConnection {
	constructor(
		private readonly chatService: ChatService,
		private readonly authService: AuthService
	) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket, ...args: any[]) {
		try {
			const user = await this.getUserFromToken(client);
			const rooms = await this.chatService.inquireAllJoinedChatRooms(user.id);
			rooms.map((room) => client.join(String(room.id)));
		} catch (e) {
			console.log('chat socket connection failure');
		}
	}

	async getUserFromToken(client: Socket): Promise<User> {
		const token = String(client.handshake.headers.authorization).replace(
			'Bearer ',
			''
		);
		const user = await this.authService.getUserByIdFromToken(token);

		if (user === null) {
			throw new BadRequestException();
		}

		return user;
	}

	@SubscribeMessage('getChats')
	@UseGuards(RoomGuard)
	async getChats(
		client: Socket,
		data: { roomId: number }
	): Promise<{ status: number; chats: ChatDto[] }> {
		try {
			const user = await this.getUserFromToken(client);

			await this.chatService.updateReadTime(data.roomId, user.id);

			const chats = await this.chatService.getChats(data.roomId, user.id);
			return { status: HttpStatus.OK, chats };
		} catch (e) {
			return { status: HttpStatus.NOT_FOUND, chats: [] };
		}
	}

	@SubscribeMessage('readChat')
	@UseGuards(RoomGuard)
	async readChat(client: Socket, data: { roomId: number }): Promise<void> {
		try {
			const user = await this.getUserFromToken(client);

			await this.chatService.updateReadTime(data.roomId, user.id);
		} catch (e) {
			console.log('exception: chat/readChat');
		}
	}

	@SubscribeMessage('sendChat')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async sendChat(client: Socket, createChatDto: CreateChatDto): Promise<void> {
		try {
			const user = await this.getUserFromToken(client);
			const { roomId } = createChatDto;
			const room = await this.chatService.getChatRoom(roomId);

			const newChat = await this.chatService.createChat(user.id, createChatDto);

			await this.chatService.updateChatRoomUpdateTime(roomId);

			if (room.roomType === ChatRoomType.DM) {
				this.server
					.to(String(roomId))
					.emit('getNewChatOnDm', { newChat, roomId });
				return;
			}
			this.server.to(String(roomId)).emit('getNewChat', { newChat, roomId });
		} catch (e) {
			console.log('exception: chat/sendChat');
		}
	}

	@SubscribeMessage('createNewDm')
	@UsePipes(ValidationPipe)
	async createNewDm(
		client: Socket,
		getDmDto: GetDmDto
	): Promise<{ status: number; dm: DmDto | null }> {
		try {
			const user = await this.getUserFromToken(client);

			const dm = await this.chatService.getDm(getDmDto, user);
			const dmForChatMate = await this.chatService.getDm(
				{ chatMate: user },
				getDmDto.chatMate
			);

			client.join(String(dm.id));

			this.server.emit('addNewDm', {
				dm: dmForChatMate,
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
		try {
			const user = await this.getUserFromToken(client);

			const room = await this.chatService.deleteParticipant(
				data.roomId,
				user.id
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

			if (
				chatParticipantDto.status === PaticipantStatus.BANNED ||
				chatParticipantDto.status === PaticipantStatus.KICKED
			) {
				this.server
					.to(String(chatParticipantDto.roomId))
					.emit('leaveTheChannel', {
						roomId: chatParticipantDto.roomId,
						userId: chatParticipantDto.user.id,
					});
			}
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
		try {
			const room = await this.chatService.addParticipants(addParticipantDto);

			client.join(String(addParticipantDto.roomId));
			this.server
				.to(String(addParticipantDto.roomId))
				.emit('updateChatRoom', room);
			this.server.emit('addNewChatRoom', {
				chatRoom: room,
				userId: addParticipantDto.participants,
			});
		} catch (e) {
			console.log('exception: chat/inviteUser');
		}
	}

	@SubscribeMessage('setChatRoom')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async setChatRoom(
		client: Socket,
		setChatRoomDto: SetChatRoomDto
	): Promise<number> {
		try {
			const user = await this.getUserFromToken(client);

			await this.chatService.setChatRoomInfo(user.id, setChatRoomDto);

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
			const user = await this.getUserFromToken(client);
			const room = await this.chatService.createChatRoom(
				createChatRoomDto,
				user
			);

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
		try {
			const user = await this.getUserFromToken(client);

			await this.chatService.deleteChatRoom(data.roomId, user.id);

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
		try {
			const user = await this.getUserFromToken(client);

			const room = await this.chatService.addParticipant(
				user.id,
				enterChatRoomDto
			);

			client.join(String(enterChatRoomDto.roomId));

			this.server
				.to(String(enterChatRoomDto.roomId))
				.emit('updateChatRoom', room);

			return { status: HttpStatus.OK, chatRoom: room };
		} catch (e) {
			if (e instanceof UnauthorizedException) {
				return { status: HttpStatus.UNAUTHORIZED, chatRoom: null };
			}
			return { status: HttpStatus.BAD_REQUEST, chatRoom: null };
		}
	}

	@SubscribeMessage('requestJoin')
	@UseGuards(RoomGuard)
	async requestJoin(client: Socket, data: { roomId: number }): Promise<void> {
		client.join(String(data.roomId));
	}

	@SubscribeMessage('requestLeave')
	@UseGuards(RoomGuard)
	async requestLeave(client: Socket, data: { roomId: number }): Promise<void> {
		client.leave(String(data.roomId));
	}
}
