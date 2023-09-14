import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './repositories/chat-room.repository';
import { ChatRoomDto } from './dto/chat-room.dto';
import { ChatParticipantRepository } from './repositories/chat-participant.repository';
import { UserRepository } from 'src/user/user.repository';
import { ChatRepository } from './repositories/chat.repository';
import { ChatDto } from './dto/chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatParticipantDto } from './dto/chat-participant.dto';

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

	async addParticipant(roomIdx: number): Promise<ChatRoomDto> {
		const room = await this.chatRoomRepository.getChatRoomEntity(roomIdx);
		const user = await this.userRepository.getUserInfobyIdx(2); //temp

		await this.chatParticipantRepository.addParticipant(room, user);
		return room;
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

	deleteChatRoom(roomIdx: number): Promise<void> {
		return this.chatRoomRepository.deleteChatRoom(roomIdx);
	}

	getChats(roomIdx: number): Promise<ChatDto[]> {
		return this.chatRepository.getChats(roomIdx);
	}

	async createChat(
		roomIdx: number,
		createChatDto: CreateChatDto
	): Promise<ChatDto> {
		const room = await this.chatRoomRepository.getChatRoomEntity(roomIdx);
		const participant =
			await this.chatParticipantRepository.getParticipantEntity(roomIdx, 1); //userIdx temp

		return this.chatRepository.createChat(room, participant, createChatDto);
	}

	getPariticipants(roomIdx: number): Promise<ChatParticipantDto[]> {
		return this.chatRoomRepository.getPariticipants(roomIdx);
	}
}
