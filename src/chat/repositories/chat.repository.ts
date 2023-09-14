import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { ChatDto } from '../dto/chat.dto';
import { plainToInstance } from 'class-transformer';
import { CreateChatDto } from '../dto/create-chat.dto';

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
}
