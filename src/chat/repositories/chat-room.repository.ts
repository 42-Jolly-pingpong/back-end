import { Injectable, Logger } from '@nestjs/common';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatRoomRepository extends Repository<ChatRoom> {
	constructor(private dataSource: DataSource) {
		super(ChatRoom, dataSource.createEntityManager());
	}

	async createChatRoom(
		createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		const { roomName, roomType, password, maxPeople } = createChatRoomDto;

		const chatRoom = this.create({
			roomName,
			roomType,
			password,
			maxPeople,
		});

		await this.save(chatRoom);
		return chatRoom;
	}

	async inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		const query = this.createQueryBuilder('room');

		const rooms = await query
			.where('room.roomType = :open', { open: ChatRoomType.PUBLIC })
			.orWhere('room.roomType = :open', { open: ChatRoomType.PROTECTED })
			.getMany();

		return rooms;
	}

	async getChatRoomEntity(roomId: number): Promise<ChatRoom> {
		return await this.findOneBy({ id: roomId });
	}

	async getChatRoomInfo(roomId: number): Promise<ChatRoomDto> {
		const query = this.createQueryBuilder('room');

		const room = await query.where('room.id = :roomId', { roomId }).getOne();

		return room;
	}

	async setChatRoomInfo(
		roomId: number,
		createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		const { roomName, roomType, password, maxPeople } = createChatRoomDto;

		const query = this.createQueryBuilder();

		query
			.update(ChatRoom)
			.set({ roomName, roomType, password, maxPeople })
			.where('id = :roomId', { roomId })
			.execute();
	}

	async deleteChatRoom(roomId: number): Promise<void> {
		const query = this.createQueryBuilder('room');

		query.delete().where('id = :roomId', { roomId }).execute();
	}
}
