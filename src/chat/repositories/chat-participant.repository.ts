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

	async createDM(room: ChatRoom, user: User, chatMate: User): Promise<void> {
		const firstParticipant = this.create({
			room,
			user,
			role: Role.MEMBER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		const secondParticipant = this.create({
			room,
			user: chatMate,
			role: Role.MEMBER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save([firstParticipant, secondParticipant]);
	}

	async registerOwner(room: ChatRoom, user: User) {
		const owner = this.create({
			room,
			user,
			role: Role.OWNER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save(owner);
	}

	async createChatRoom(
		room: ChatRoom,
		owner: User,
		users: UserDto[]
	): Promise<void> {
		this.registerOwner(room, owner);

		const participants = users.map((user) => {
			return this.create({
				room,
				user,
				role: Role.MEMBER,
				status: PaticipantStatus.DEFAULT,
				muteExpirationTime: null,
			});
		});

		await this.save(participants);
	}

	async inquireChatRoom(user: UserDto): Promise<ChatRoom[]> {
		const query = this.createQueryBuilder('participant');

		const users = await query
			.leftJoinAndSelect('participant.room', 'room')
			.leftJoinAndSelect('participant.user', 'user')
			.where('user.id=:userId', { userId: user.id })
			.getMany();

		const rooms = users.map((user) => user.room);
		return rooms;
	}

	async getParticipant(
		roomId: number,
		userId: number
	): Promise<ChatParticipant> {
		const query = this.createQueryBuilder('participant');

		const user = await query
			.where('participant.roomId = :roomId', { roomId })
			.andWhere('participant.userId = :userId', { userId })
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
		const query = this.createQueryBuilder('participant');

		const participants = await query
			.where('participant.roomId = :roomId', { roomId })
			.getMany();

		return participants;
	}

	async setParticipantStatus(
		roomId: number,
		setParticipantDto: SetParticipantStatusDto,
		muteExpirationTime: Date = null
	): Promise<void> {
		const { user, status } = setParticipantDto;
		const userId = user.id;
		const query = this.createQueryBuilder();

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
			.where('participant.userId = :userId', { userId })
			.andWhere('participant.roomId = :roomId', { roomId })
			.getOne();

		if (participant == null) {
			return null;
		}
		this.delete(participant.id);

		return participant;
	}
}
