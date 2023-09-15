import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatParticipant } from '../entities/chat-participant.entity';
import { PaticipantStatus } from '../enums/paticipant-status.enum';
import { Role } from '../enums/role.enum';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { ChatRoom } from '../entities/chat-room.entity';
import { ChatParticipantDto } from '../dto/chat-participant.dto';
import { SetParticipantDto } from '../dto/set-participant.dto';

@Injectable()
export class ChatParticipantRepository extends Repository<ChatParticipant> {
	constructor(private dataSource: DataSource) {
		super(ChatParticipant, dataSource.createEntityManager());
	}

	async createChatRoom(room: ChatRoomDto, user: UserInfoDTO): Promise<void> {
		const participant = this.create({
			room,
			user,
			role: Role.OWNER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save(participant);
	}

	async inquireChatRoom(userIdx: number): Promise<ChatRoomDto[]> {
		const query = this.createQueryBuilder('part');

		const users = await query
			.leftJoinAndSelect('part.room', 'room')
			.leftJoinAndSelect('part.user', 'user')
			.where('user.userIdx=:userIdx', { userIdx })
			.getMany();

		const rooms = users.map((user) => user.room);
		return rooms;
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
			role: Role.NORMAL_USER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save(participant);
	}

	async getPariticipants(roomIdx: number): Promise<ChatParticipantDto[]> {
		const query = this.createQueryBuilder('user');

		const users = await query
			.where('user.roomIdx = :roomIdx', { roomIdx })
			.getMany();

		return users;
	}

	async setParticipantStatus(
		roomIdx: number,
		setParticipantDto: SetParticipantDto
	) {
		const { user, status, muteExpirationTime } = setParticipantDto;
		const userIdx = user.userIdx;
		const query = this.createQueryBuilder();

		query
			.update(ChatParticipant)
			.set({ status, muteExpirationTime })
			.where('roomIdx = :roomIdx', { roomIdx })
			.andWhere('userIdx = :userIdx', { userIdx })
			.execute();
	}

	async setParticipantAuth(
		roomIdx: number,
		setParticipantDto: SetParticipantDto
	) {
		const { user, role } = setParticipantDto;
		const userIdx = user.userIdx;
		const query = this.createQueryBuilder();

		query
			.update(ChatParticipant)
			.set({ role })
			.where('roomIdx = :roomIdx', { roomIdx })
			.andWhere('userIdx = :userIdx', { userIdx })
			.execute();
	}

	async deleteParticipant(roomIdx: number, userIdx: number): Promise<void> {
		const query = this.createQueryBuilder('user');

		query
			.delete()
			.where('userIdx = :userIdx', { userIdx })
			.andWhere('roomIdx = :roomIdx', { roomIdx })
			.execute();
	}
}
