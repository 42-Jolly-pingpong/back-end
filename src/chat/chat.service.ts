import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './repositories/chat-room.repository';
import { ChatRoomDto } from './dto/chat-room.dto';
import { ChatParticipantRepository } from './repositories/chat-participant.repository copy';
import { UserRepository } from 'src/user/user.repository';
import { ChatRepository } from './repositories/chat.repository';

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

	async createChatRoom(
		createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		const room = await this.chatRoomRepository.createChatRoom(
			createChatRoomDto
		);
		const user = await this.userRepository.getUserInfobyIdx(1); //temp

		await this.chatParticipantRepository.createChatRoom(room, user);

		return room;
	}

	inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		return this.chatRoomRepository.inquireOpenedChatRoom();
	}

	getChatRoomInfo(roomIdx: number): Promise<ChatRoomDto> {
		return this.chatRoomRepository.getChatRoomInfo(roomIdx);
	}

	setChatRoomInfo(
		roomIdx: number,
		createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		return this.chatRoomRepository.setChatRoomInfo(roomIdx, createChatRoomDto);
	}
}
