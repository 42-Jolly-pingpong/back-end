import { CreateChatRoomDto } from './../dto/create-chat-room.dto';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { ChatRoomType } from '../enums/chat-room-type.enum';

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

	async inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		const query = this.createQueryBuilder('room');

		query
			.where('room.roomType = :open', { open: ChatRoomType.PUBLIC })
			.orWhere('room.roomType = :open', { open: ChatRoomType.PROTECTED });

		const rooms = await query.getMany();

		return rooms;
	}

	async getChatRoomInfo(roomIdx: number): Promise<ChatRoomDto> {
		const query = this.createQueryBuilder('room');

		query.where('room.roomIdx = :roomIdx', { roomIdx });

		const room = await query.getOne();

		return room;
	}

	async setChatRoomInfo(
		roomIdx: number,
		createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		const { roomName, roomType, password, maxPeople } = createChatRoomDto;

		const query = this.createQueryBuilder();

		query
			.update(ChatRoom)
			.set({ roomName, roomType, password, maxPeople })
			.where('roomIdx = :roomIdx', { roomIdx })
			.execute();
	}

	async deleteChatRoom(roomIdx: number): Promise<void> {
		const query = this.createQueryBuilder('room');

		query.delete().where('roomIdx = :roomIdx', { roomIdx }).execute();
	}
}
