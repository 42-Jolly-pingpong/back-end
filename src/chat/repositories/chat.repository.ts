import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatRepository extends Repository<Chat> {
	constructor(private dataSource: DataSource) {
		super(Chat, dataSource.createEntityManager());
	}

	async getChats(roomId: number): Promise<ChatDto[]> {
		const query = this.createQueryBuilder('chat');

		const chats = await query
			.leftJoinAndSelect('chat.user', 'participant')
			.leftJoinAndSelect('participant.user', 'user')
			.leftJoinAndSelect('chat.room', 'room')
			.where('chat.roomId = :roomId', { roomId })
			.getMany();

		return plainToInstance(ChatDto, chats);
	}

	async createChat(
		room: ChatRoom,
		user: ChatParticipant,
		content: string
	): Promise<ChatDto> {
		const chat = this.create({ content, room, user });

		return await this.save(chat);
	}
}
