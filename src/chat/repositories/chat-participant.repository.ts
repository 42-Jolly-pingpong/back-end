import { Injectable, Logger } from '@nestjs/common';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { SetParticipantRoleDto } from 'src/chat/dto/set-participant-role.dto';
import { SetParticipantStatusDto } from 'src/chat/dto/set-participant-status.dto';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { Role } from 'src/chat/enums/role.enum';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatParticipantRepository extends Repository<ChatParticipant> {
	constructor(private dataSource: DataSource) {
		super(ChatParticipant, dataSource.createEntityManager());
	}

	async createDm(room: ChatRoom, user: User, chatMate: User): Promise<void> {
		const firstParticipant = this.create({
			room,
			user,
			role: Role.MEMBER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
			lastReadTime: new Date(),
		});

		const secondParticipant = this.create({
			room,
			user: chatMate,
			role: Role.MEMBER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
			lastReadTime: new Date(),
		});

		await this.save([firstParticipant, secondParticipant]);
	}

	async createChatRoom(room: ChatRoom, user: User): Promise<ChatParticipant> {
		const owner = this.create({
			room,
			user,
			role: Role.OWNER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
			lastReadTime: new Date(),
		});

		await this.save(owner);

		return owner;
	}

	async getParticipant(
		roomId: number,
		userId: number
	): Promise<ChatParticipant> {
		const query = this.createQueryBuilder('participant');

		const user = await query
			.leftJoinAndSelect('participant.user', 'user')
			.where('participant.roomId = :roomId', { roomId })
			.andWhere('user.id = :userId', { userId })
			.getOne();

		return user;
	}

	async addParticipants(room: ChatRoom, users: UserDto[]): Promise<void> {
		const participants = users.map((user) => {
			return this.create({
				room,
				user,
				role: Role.MEMBER,
				status: PaticipantStatus.DEFAULT,
				muteExpirationTime: null,
				lastReadTime: new Date(),
			});
		});

		await this.save(participants);
	}

	async addParticipant(room: ChatRoom, user: UserDto): Promise<void> {
		const participant = this.create({
			room,
			user,
			role: Role.MEMBER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
			lastReadTime: new Date(),
		});

		await this.save(participant);
	}

	async getParticipants(roomId: number): Promise<ChatParticipantDto[]> {
		const query = this.createQueryBuilder('participant');

		const participants = await query
			.where('participant.roomId = :roomId', { roomId })
			.getMany();

		return participants;
	}

	async updateReadTime(roomId: number, userId: number): Promise<void> {
		const query = this.createQueryBuilder('participant');

		query
			.update(ChatParticipant)
			.set({ lastReadTime: new Date() })
			.where('roomId = :roomId', { roomId })
			.andWhere('userId = :userId', { userId })
			.execute();

		return;
	}

	async setParticipantStatus(
		roomId: number,
		setParticipantDto: SetParticipantStatusDto,
		muteExpirationTime: Date = null
	): Promise<void> {
		const { user, status } = setParticipantDto;
		const userId = user.id;
		const query = this.createQueryBuilder();

		if (muteExpirationTime === null) {
			query
				.update(ChatParticipant)
				.set({ status, role: Role.MEMBER })
				.where('roomId = :roomId', { roomId })
				.andWhere('userId = :userId', { userId })
				.execute();

			return;
		}
		query
			.update(ChatParticipant)
			.set({ status, muteExpirationTime })
			.where('roomId = :roomId', { roomId })
			.andWhere('userId = :userId', { userId })
			.execute();
	}

	async setParticipantRole(
		roomId: number,
		setParticipantDto: SetParticipantRoleDto
	): Promise<void> {
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

	async deleteParticipant(
		roomId: number,
		userId: number
	): Promise<ChatParticipant> {
		const query = this.createQueryBuilder('participant');

		const participant = await query
			.update(ChatParticipant)
			.set({ status: PaticipantStatus.LEFT, role: Role.MEMBER })
			.where('roomId = :roomId', { roomId })
			.andWhere('userId = :userId', { userId })
			.execute();

		if (participant.raw === null) {
			return null;
		}

		return participant.raw;
	}
}
