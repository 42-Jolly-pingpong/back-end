import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomRepository } from './repositories/chat-room.repository';
import { ChatRoomDto } from './dto/chat-room.dto';

@Injectable()
export class ChatRoomService {
	constructor(
		@InjectRepository(ChatRoomRepository)
		private chatRoomRepository: ChatRoomRepository
	) {}

	async createChatRoom(
		createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		return await this.chatRoomRepository.createChatRoom(createChatRoomDto);
	}
}
