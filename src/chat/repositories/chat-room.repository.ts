import { Injectable, Logger } from '@nestjs/common';
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
	): Promise<ChatRoom> {
		const { roomName, roomType, password } = createChatRoomDto;

		const chatRoom = this.create({
			roomName,
			roomType,
			password,
		});

		await this.save(chatRoom);
		return chatRoom;
	}

	async getDM(roomName: string): Promise<ChatRoom> {
		const query = this.createQueryBuilder('room');

		const room = await query
			.leftJoinAndSelect('room.participants', 'participant')
			.leftJoinAndSelect('participant.user', 'user')
			.where('room.roomName = :roomName', { roomName })
			.getOne();

		return room;
	}

	async createDM(roomName: string): Promise<ChatRoom> {
		const chatRoom = this.create({
			roomName,
			roomType: ChatRoomType.DM,
			password: null,
		});

		await this.save(chatRoom);
		return chatRoom;
	}

	async inquireOpenedChatRoom(): Promise<ChatRoom[]> {
		const query = this.createQueryBuilder('room');

		const rooms = await query
			.leftJoinAndSelect('room.participants', 'participant')
			.leftJoinAndSelect('participant.user', 'user')
			.where('room.roomType = :open', { open: ChatRoomType.PUBLIC })
			.orWhere('room.roomType = :open', { open: ChatRoomType.PROTECTED })
			.getMany();

		return rooms;
	}

	async getChatRoom(roomId: number): Promise<ChatRoom> {
		const room = await this.findOne({
			where: {
				id: roomId,
			},
			relations: ['participants', 'participants.user'],
		});

		return room;
	}

	async setChatRoomInfo(
		roomId: number,
		createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		const { roomName, roomType, password } = createChatRoomDto;

		const query = this.createQueryBuilder();

		query
			.update(ChatRoom)
			.set({ roomName, roomType, password })
			.where('id = :roomId', { roomId })
			.execute();
	}

	async deleteChatRoom(roomId: number): Promise<void> {
		const query = this.createQueryBuilder('room');

		query.delete().where('id = :roomId', { roomId }).execute();
	}
}
