import {
	ConflictException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { EnterChatRoomDto } from 'src/chat/dto/enter-chat-room.dto';
import { SetParticipantDto } from 'src/chat/dto/set-participant.dto';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { ChatParticipantRepository } from 'src/chat/repositories/chat-participant.repository';
import { ChatRoomRepository } from 'src/chat/repositories/chat-room.repository';
import { ChatRepository } from 'src/chat/repositories/chat.repository';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoomRepository)
		private chatRoomRepository: ChatRoomRepository,
		@InjectRepository(ChatParticipantRepository)
		private chatParticipantRepository: ChatParticipantRepository,
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		@InjectRepository(ChatRepository)
		private chatRepository: ChatRepository
	) {}

	async checkIfRoomExist(roomId: number): Promise<boolean> {
		const room = await this.chatRoomRepository.getChatRoomEntity(roomId);
		if (room == null) {
			return false;
		}
		return true;
	}

	async createChatRoom(
		createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		const room = await this.chatRoomRepository.createChatRoom(
			createChatRoomDto
		);
		const user = await this.userRepository.findUserById(1); //temp

		await this.chatParticipantRepository.createChatRoom(room, user);

		return room;
	}

	async inquireChatRoom(userId: number): Promise<ChatRoomDto[]> {
		const user = await this.userRepository.findUserById(userId); //temp

		return this.chatParticipantRepository.inquireChatRoom(user);
	}

	inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		return this.chatRoomRepository.inquireOpenedChatRoom();
	}

	checkUserInChatRoom(participants: ChatParticipant[], user: User): boolean {
		return participants.some((participant) => participant.user.id === user.id);
	}

	async addParticipant(
		roomId: number,
		enterChatRoomDto: EnterChatRoomDto
	): Promise<ChatRoomDto> {
		const room = await this.chatRoomRepository.getChatRoomEntity(roomId);
		if (
			room.roomType == ChatRoomType.PROTECTED &&
			enterChatRoomDto.password != null
		) {
			if (enterChatRoomDto.password != room.password) {
				throw new UnauthorizedException();
			}
		}
		const user = await this.userRepository.findUserById(1); //temp
		if (this.checkUserInChatRoom(room.participants, user)) {
			throw new ConflictException();
		}

		await this.chatParticipantRepository.addParticipant(room, user);
		return room;
	}

	getChatRoomInfo(roomId: number): Promise<ChatRoomDto> {
		return this.chatRoomRepository.getChatRoomInfo(roomId);
	}

	setChatRoomInfo(
		roomId: number,
		createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		return this.chatRoomRepository.setChatRoomInfo(roomId, createChatRoomDto);
	}

	deleteChatRoom(roomId: number): Promise<void> {
		return this.chatRoomRepository.deleteChatRoom(roomId);
	}

	getChats(roomId: number): Promise<ChatDto[]> {
		return this.chatRepository.getChats(roomId);
	}

	async createChat(
		roomId: number,
		createChatDto: CreateChatDto
	): Promise<ChatDto> {
		const room = await this.chatRoomRepository.getChatRoomEntity(roomId);
		const participant =
			await this.chatParticipantRepository.getParticipantEntity(roomId, 1); //userId temp

		return this.chatRepository.createChat(room, participant, createChatDto);
	}

	getPariticipants(roomId: number): Promise<ChatParticipantDto[]> {
		return this.chatParticipantRepository.getPariticipants(roomId);
	}

	setParticipantStatus(roomId: number, setParticipantDto: SetParticipantDto) {
		if (setParticipantDto.status == PaticipantStatus.MUTED) {
			const mutedTime = new Date();
			mutedTime.setMinutes(mutedTime.getMinutes() + 5);
			setParticipantDto.muteExpirationTime = mutedTime;
		}

		return this.chatParticipantRepository.setParticipantStatus(
			roomId,
			setParticipantDto
		);
	}

	setParticipantAuth(roomId: number, setParticipantDto: SetParticipantDto) {
		return this.chatParticipantRepository.setParticipantAuth(
			roomId,
			setParticipantDto
		);
	}

	async setParticipantInfo(
		roomId: number,
		setParticipantDto: SetParticipantDto
	) {
		const admin = await this.userRepository.findUserById(1); //temp

		if (setParticipantDto.status != null) {
			this.setParticipantStatus(roomId, setParticipantDto);
			return;
		} else if (setParticipantDto.role != null) {
			this.setParticipantAuth(roomId, setParticipantDto);
			return;
		}
	}

	async deleteParticipant(roomId: number, userId: number): Promise<void> {
		try {
			return await this.chatParticipantRepository.deleteParticipant(
				roomId,
				userId
			);
		} catch (error) {
			throw error;
		}
	}
}
