import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatRepository extends Repository<Chat> {
	constructor(private dataSource: DataSource) {
		super(Chat, dataSource.createEntityManager());
	}

	async getChats(roomIdx: number): Promise<ChatDto[]> {
		const query = this.createQueryBuilder('chat');

		const chats = await query.where('chat.roomIdx = :roomIdx', { roomIdx }).getMany();

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
