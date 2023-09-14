import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatParticipant } from '../entities/chat-participant.entity';
import { PaticipantStatus } from '../enums/paticipant-status.enum';
import { RoomAuth } from '../enums/room-auth.enum';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { ChatRoom } from '../entities/chat-room.entity';

@Injectable()
export class ChatParticipantRepository extends Repository<ChatParticipant> {
	constructor(private dataSource: DataSource) {
		super(ChatParticipant, dataSource.createEntityManager());
	}

	async createChatRoom(room: ChatRoomDto, user: UserInfoDTO): Promise<void> {
		const participant = this.create({
			room,
			user,
			roomAuth: RoomAuth.OWNER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save(participant);
	}

	async getParticipantEntity(
		roomIdx: number,
		userIdx: number
	): Promise<ChatParticipant> {
		const query = this.createQueryBuilder('user');

		const user = await query
			.where('user.roomIdx = :roomIdx', { roomIdx })
			.andWhere('user.userIdx = :userIdx', { userIdx })
			.getOne();

		return user;
	}

	async addParticipant(room: ChatRoom, user: UserInfoDTO): Promise<void> {
		const participant = this.create({
			room,
			user,
			roomAuth: RoomAuth.NORMAL_USER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save(participant);
	}
}
