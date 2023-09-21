import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { SetParticipantDto } from 'src/chat/dto/set-participant.dto';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { Role } from 'src/chat/enums/role.enum';
import { UserDto } from 'src/user/dto/user.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatParticipantRepository extends Repository<ChatParticipant> {
	constructor(private dataSource: DataSource) {
		super(ChatParticipant, dataSource.createEntityManager());
	}

	async createChatRoom(room: ChatRoomDto, user: UserDto): Promise<void> {
		const participant = this.create({
			room,
			user,
			role: Role.OWNER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save(participant);
	}

	async inquireChatRoom(user: UserDto): Promise<ChatRoomDto[]> {
		const query = this.createQueryBuilder('part');

		const users = await query
			.leftJoinAndSelect('part.room', 'room')
			.leftJoinAndSelect('part.user', 'user')
			.where('user.id=:userId', { userId: user.id })
			.getMany();

		const rooms = users.map((user) => user.room);
		return rooms;
	}

	async getParticipantEntity(
		roomId: number,
		userId: number
	): Promise<ChatParticipant> {
		const query = this.createQueryBuilder('user');

		const user = await query
			.where('user.roomId = :roomId', { roomId })
			.andWhere('user.userId = :userId', { userId })
			.getOne();

		return user;
	}

	async addParticipant(room: ChatRoom, user: UserDto): Promise<void> {
		const participant = this.create({
			room,
			user,
			role: Role.MEMBER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save(participant);
	}

	async getPariticipants(roomId: number): Promise<ChatParticipantDto[]> {
		const query = this.createQueryBuilder('user');

		const users = await query
			.where('user.roomId = :roomId', { roomId })
			.getMany();

		return users;
	}

	async setParticipantStatus(
		roomId: number,
		setParticipantDto: SetParticipantDto
	) {
		const { user, status, muteExpirationTime } = setParticipantDto;
		const userId = user.id;
		const query = this.createQueryBuilder();

		query
			.update(ChatParticipant)
			.set({ status, muteExpirationTime })
			.where('roomId = :roomId', { roomId })
			.andWhere('userId = :userId', { userId })
			.execute();
	}

	async setParticipantAuth(
		roomId: number,
		setParticipantDto: SetParticipantDto
	) {
		const { user, role } = setParticipantDto;
		const userId = user.id;
		const query = this.createQueryBuilder();

		query
			.update(ChatParticipant)
			.set({ role })
			.where('roomId = :roomId', { roomId })
			.andWhere('userId = :userId', { userId })
			.execute();
	}

	async deleteParticipant(roomId: number, userId: number): Promise<void> {
		const query = this.createQueryBuilder('user');

		const participant = await query
			.where('user.userId = :userId', { userId })
			.andWhere('user.roomId = :roomId', { roomId })
			.getOne();

		if (participant == null) {
			throw new HttpException(
				'존재하지않는 참여자입니다.',
				HttpStatus.NOT_FOUND
			);
		}

		this.delete(participant.id);
	}
}
