import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { ChatRoomDto } from '../dto/chat-room.dto';

@Injectable()
export class ChatRoomRepository extends Repository<ChatRoom> {
	constructor(private dataSource: DataSource) {
		super(ChatRoom, dataSource.createEntityManager());
	}

	async createChatRoom(
		createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		const { roomName, roomType, password, maxPeople, currentPeople } =
			createChatRoomDto;

		const chatRoom = this.create({
			roomName,
			roomType,
			password,
			maxPeople,
			currentPeople,
		});

		await this.save(chatRoom);
		return chatRoom;
	}
}
