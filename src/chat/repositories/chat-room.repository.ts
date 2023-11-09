import { Injectable, Logger } from '@nestjs/common';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { UserDto } from 'src/user/dto/user.dto';
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

	async updateChatRoomUpdateTime(roomId: number): Promise<void> {
		const query = this.createQueryBuilder();

		query.update(ChatRoom).set({}).where('id = :roomId', { roomId }).execute();

		return;
	}

	async getDm(roomName: string): Promise<ChatRoom> {
		const query = this.createQueryBuilder('room');

		const room = await query
			.leftJoinAndSelect('room.participants', 'participant')
			.leftJoinAndSelect('participant.user', 'user')
			.where('room.roomName = :roomName', { roomName })
			.getOne();

		return room;
	}

	async createDm(roomName: string): Promise<ChatRoom> {
		const chatRoom = this.create({
			roomName,
			roomType: ChatRoomType.DM,
			password: null,
		});

		await this.save(chatRoom);
		return chatRoom;
	}

	async inquireAllJoinedChatRooms(userId: number): Promise<ChatRoom[]> {
		const query = this.createQueryBuilder('room');

		const rooms = await query
			.leftJoinAndSelect('room.participants', 'participant')
			.leftJoinAndSelect('participant.user', 'user')
			.where('user.id=:userId', { userId })
			.andWhere('participant.status IN (:...status)', {
				status: [PaticipantStatus.DEFAULT, PaticipantStatus.MUTED],
			})
			.leftJoinAndSelect('room.participants', 'all_participant')
			.leftJoinAndSelect('all_participant.user', 'all_user')
			.getMany();

		return rooms;
	}

	async inquireOpenedChatRoom(user: UserDto): Promise<ChatRoom[]> {
		const query = this.createQueryBuilder('room');

		const rooms = await query
			.leftJoinAndSelect('room.participants', 'participant')
			.leftJoinAndSelect('participant.user', 'user')
			.where('room.roomType IN (:...open)', {
				open: [ChatRoomType.PUBLIC, ChatRoomType.PROTECTED],
			})
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
