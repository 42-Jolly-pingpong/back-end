import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { ChatDto } from '../dto/chat.dto';
import { plainToInstance } from 'class-transformer';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatRoom } from '../entities/chat-room.entity';
import { ChatParticipant } from '../entities/chat-participant.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
	constructor(private dataSource: DataSource) {
		super(Chat, dataSource.createEntityManager());
	}

	async getChats(roomIdx: number): Promise<ChatDto[]> {
		const query = this.createQueryBuilder('chat');

		const chats = await query
			.where('chat.roomIdx = :roomIdx', { roomIdx })
			.getMany();

		return plainToInstance(ChatDto, chats);
	}

	async createChat(
		room: ChatRoom,
		user: ChatParticipant,
		createChatDto: CreateChatDto
	): Promise<ChatDto> {
		const { content } = createChatDto;
		const chat = this.create({ content, room, user });

		return await this.save(chat);
	}
}
