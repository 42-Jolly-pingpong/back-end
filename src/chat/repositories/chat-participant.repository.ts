import { Injectable, Logger } from '@nestjs/common';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { SetParticipantDto } from 'src/chat/dto/set-participant.dto';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { Role } from 'src/chat/enums/role.enum';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { DataSource, Repository } from 'typeorm';

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
			role: Role.MEMBER,
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
