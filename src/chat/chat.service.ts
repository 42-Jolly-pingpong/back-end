import { AddParticipantDto } from './dto/add-participant.dto';
import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { DmDto } from 'src/chat/dto/dm.dto';
import { EnterChatRoomDto } from 'src/chat/dto/enter-chat-room.dto';
import { GetDmDto } from 'src/chat/dto/get-dm.dto';
import { SetChatRoomDto } from 'src/chat/dto/set-chat-room.dto';
import { SetParticipantRoleDto } from 'src/chat/dto/set-participant-role.dto';
import { SetParticipantStatusDto } from 'src/chat/dto/set-participant-status.dto';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { Role } from 'src/chat/enums/role.enum';
import { ChatParticipantRepository } from 'src/chat/repositories/chat-participant.repository';
import { ChatRoomRepository } from 'src/chat/repositories/chat-room.repository';
import { ChatRepository } from 'src/chat/repositories/chat.repository';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoomRepository)
		private chatRoomRepository: ChatRoomRepository,
		@InjectRepository(ChatParticipantRepository)
		private chatParticipantRepository: ChatParticipantRepository,
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		@InjectRepository(ChatRepository)
		private chatRepository: ChatRepository
	) {}

	/**
	 * roomEntityToDto() 함수를 사용해 ChatRoom entity배열을 ChatRoomDto로 변환한다.
	 * @param rooms 변환할 엔티티 배열.
	 * @param userId 마지막으로 읽을 시간을 확인하기 위해 필요한 user id
	 * @returns 변환된 Dto 배열을 반환한다.
	 */
	async roomsEntityToDto(
		rooms: ChatRoom[],
		userId: number
	): Promise<ChatRoomDto[]> {
		const promises = rooms.map(async (room) => {
			return this.roomEntityToDto(
				room,
				await this.chatParticipantRepository.getParticipant(room.id, userId)
			);
		});

		return Promise.all(promises);
	}

	/**
	 * entity에는 없지만 dto에는 존재하는 currentPeople값을 생성한 후 dto로 변환한다.
	 * participants리스트를 이용해 currentPeople을 계산한다.
	 * @param room dto로 변경할 ChatRoom entity.
	 * @param participant 마지막으로 읽을 시간을 확인하기 위해 필요한 참가자 정보
	 * @returns 변경된 dto를 반환한다.
	 * @returns
	 */
	roomEntityToDto(room: ChatRoom, participant: ChatParticipant): ChatRoomDto {
		const leftToRead =
			participant === null || room.updatedTime <= participant.lastReadTime
				? false
				: true;

		const dto: ChatRoomDto = {
			id: room.id,
			roomName: room.roomName,
			roomType: room.roomType,
			createdAt: room.createdAt,
			updatedTime: room.updatedTime,
			status: room.status,
			currentPeople: room.participants.filter(
				(participant) =>
					participant.status === PaticipantStatus.DEFAULT ||
					participant.status === PaticipantStatus.MUTED
			).length,
			participants: room.participants,
			leftToRead,
		};
		return dto;
	}

	/**
	 * room id에 해당하는 room이 존재하는지 확인한다.
	 * @param roomId 확인할 room의 id
	 * @returns 존재하면 true, 존재하지않으면 false를 반환한다.
	 */
	async checkIfRoomExist(roomId: number): Promise<boolean> {
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		if (room === null) {
			return false;
		}
		return true;
	}

	/**
	 * 채팅방 참가자의 상태를 확인한다.
	 * @param participants
	 * @param user
	 * @returns 참가자의 상태를 반환한다. 참가하지 않은 유저면 null을 반환한다.
	 */
	getParticipantStatus(
		participants: ChatParticipant[],
		user: User
	): PaticipantStatus {
		const participant = participants.find((participant) => {
			if (participant.user.id === user.id) {
				return participant;
			}
		});
		if (participant === undefined) {
			return null;
		}
		return participant.status;
	}

	/**
	 * dm방을 반환한다.
	 * @param getDmDto 대화를 나눌 유저의 정보가 담긴 dto
	 * @param userId
	 * @returns
	 */
	async getDm(getDmDto: GetDmDto, user: User): Promise<DmDto> {
		const chatMateId = getDmDto.chatMate.id;
		if (user.id === chatMateId) {
			throw new ConflictException();
		}
		const chatMate = await this.userRepository.findUserById(chatMateId);
		if (chatMate === null) {
			throw new NotFoundException();
		}

		const roomName = this.createDmName(user.id, chatMateId);
		const room = await this.chatRoomRepository.getDm(roomName);
		if (room !== null) {
			return this.roomToDmDto(
				room,
				await this.chatParticipantRepository.getParticipant(room.id, user.id)
			);
		}
		return this.createDm(user, chatMate);
	}

	/**
	 * dm방에 참여 중인 두 유저의 id를 이용해 private방의 제목을 생성한다.
	 * @param userId
	 * @param chatMateId
	 * @returns roomName을 반환한다.
	 */
	createDmName(userId: number, chatMateId: number): string {
		if (userId < chatMateId) {
			return `DM ${userId}, ${chatMateId}`;
		}
		return `DM ${chatMateId}, ${userId}`;
	}

	/**
	 * 반환할 dm room이 존재하지 않는 경우 새로 생성한다.
	 * @param user
	 * @param chatMate
	 * @returns dm room을 반환한다.
	 */
	async createDm(user: User, chatMate: User): Promise<DmDto> {
		const roomName = this.createDmName(user.id, chatMate.id);
		const emptyRoom = await this.chatRoomRepository.createDm(roomName);
		await this.chatParticipantRepository.createDm(emptyRoom, user, chatMate);
		const room = await this.chatRoomRepository.getChatRoom(emptyRoom.id);
		return this.roomToDmDto(
			room,
			await this.chatParticipantRepository.getParticipant(room.id, user.id)
		);
	}

	/**
	 * user들의 id가 담긴 리스트를 받아 UserDto의 리스트로 변환한다.
	 * 방에 들어온 적 없던 사람들만 포함된다.
	 * @param roomId
	 * @param ids
	 * @returns UserDto의 리스트를 반환한다.
	 */
	async makeNewParticipantList(
		roomId: number,
		ids: number[]
	): Promise<UserDto[]> {
		const users: UserDto[] = [];

		for (const id of ids) {
			const participant = await this.chatParticipantRepository.getParticipant(
				roomId,
				id
			);
			if (participant !== null) {
				continue;
			} //이미 참여하고있는 사람인지 확인한다. 아니라면 진행하고 참여하고있다면 continue한다.

			const user = await this.userRepository.findUserById(id);
			if (user !== null) {
				users.push(user);
			} //존재하는 유저인지 확인 후, 존재하면 추가한다.
		}

		return users;
	}

	/**
	 * user들의 id가 담긴 리스트를 받아 UserDto의 리스트로 변환한다.
	 * 방에 들어온 적 있지만 다시 들어올 수 있는 유저들의 목록만 포함한다.
	 * @param roomId
	 * @param ids
	 * @returns UserDto의 리스트를 반환한다.
	 */
	async makeParticipantList(
		roomId: number,
		ids: number[]
	): Promise<[UserDto[], UserDto[]]> {
		const users: UserDto[] = [];
		const mutedUsers: UserDto[] = [];

		for (const id of ids) {
			const participant = await this.chatParticipantRepository.getParticipant(
				roomId,
				id
			);
			if (
				participant !== null &&
				[PaticipantStatus.KICKED, PaticipantStatus.LEFT].includes(
					participant.status
				)
			) {
				const user = await this.userRepository.findUserById(id);
				if (user !== null) {
					if (
						participant.muteExpirationTime &&
						new Date() < participant.muteExpirationTime
					) {
						mutedUsers.push(user);
					} else {
						users.push(user);
					}
				} //다시 들어올 수 있는 사람인 지 확인한다.
			} //존재하는 유저인지 확인 후, 존재하면 추가한다.
		}

		return [users, mutedUsers];
	}

	/**
	 * 새로운 chat-room을 생성한 후, owner가 초대한 유저들을 참가자로 추가한다.
	 * @param createChatRoomDto
	 * @returns 생성된 chat-room을 반환한다.
	 */
	async createChatRoom(
		createChatRoomDto: CreateChatRoomDto,
		user: User
	): Promise<ChatRoomDto> {
		const emptyRoom = await this.chatRoomRepository.createChatRoom(
			createChatRoomDto
		);

		const participant = await this.chatParticipantRepository.createChatRoom(
			emptyRoom,
			user
		);

		const room = await this.chatRoomRepository.getChatRoom(emptyRoom.id);

		return this.roomEntityToDto(room, participant);
	}

	/**
	 * chat-room을 DmDto로 변환한다.
	 * @param room
	 * @param userId
	 * @returns 변환된 DmDto를 반환한다.
	 */
	roomToDmDto(room: ChatRoom, user: ChatParticipant): DmDto {
		const chatMate = room.participants.filter(
			(participant) => participant.user.id !== user.user.id
		)[0].user;

		const dm: DmDto = {
			id: room.id,
			roomType: ChatRoomType.DM,
			chatMate: chatMate,
			updatedTime: room.updatedTime,
			status: room.status,
			leftToRead: room.updatedTime <= user.lastReadTime ? false : true,
		};
		return dm;
	}

	/**
	 * chat-room리스트를 전달받아 DmDto리스트로 변환한다.
	 * @param rooms
	 * @param userId
	 * @returns 변한된 DmDto 리스트를 반환한다.
	 */
	async roomsToDmDto(rooms: ChatRoom[], userId: number): Promise<DmDto[]> {
		const dms = rooms.map(async (room) => {
			return this.roomToDmDto(
				room,
				await this.chatParticipantRepository.getParticipant(room.id, userId)
			);
		});

		return Promise.all(dms);
	}

	/**
	 * 유저가 참여하고있는 모든 dm을 조회한다.
	 * @param userId
	 * @returns 참여하고있는 dm(dto) 리스트를 반환한다.
	 */
	async inquireDms(userId: number): Promise<DmDto[]> {
		const allRooms = await this.inquireAllJoinedChatRooms(userId);
		const allChannels = allRooms.filter(
			(room) => room.roomType === ChatRoomType.DM
		);

		return this.roomsToDmDto(allChannels, userId);
	}

	/**
	 * 유저가 참여하고있는 모든 channel을 조회한다(DM제외).
	 * @param userId
	 * @returns 참여하고있는 channel(dto) 리스트를 반환한다.
	 */
	async inquireJoinedChannels(userId: number): Promise<ChatRoomDto[]> {
		const allRooms = await this.inquireAllJoinedChatRooms(userId);
		const allChannels = allRooms.filter(
			(room) => room.roomType !== ChatRoomType.DM
		);

		return this.roomsEntityToDto(allChannels, userId);
	}

	/**
	 * 유저가 참여하고있는 모든 chat-room을 조회한다.
	 * @param userId
	 * @returns 참여하고있는 chat-room 리스트를 반환한다.
	 */
	async inquireAllJoinedChatRooms(userId: number): Promise<ChatRoom[]> {
		return await this.chatRoomRepository.inquireAllJoinedChatRooms(userId);
	}

	/**
	 * 존재하는 오픈 채팅방 중 사용자가 밴 당하지 않은 채팅방을 조회한다.
	 * @param userId
	 * @returns 존재하는 오픈 채팅방 리스트를 반환한다.
	 */
	async inquireOpenedChatRoom(user: User): Promise<ChatRoomDto[]> {
		const allRoom = await this.chatRoomRepository.inquireOpenedChatRoom(user);
		const roomsWithoutBanned = allRoom.filter(
			(room) =>
				this.getParticipantStatus(room.participants, user) !==
				PaticipantStatus.BANNED
		);

		return this.roomsEntityToDto(roomsWithoutBanned, user.id);
	}

	/**
	 * 존재하는 채팅방에 새로운 유저를 입장시킨다.
	 * @param roomId 참여할 방의 id
	 * @param enterChatRoomDto
	 * @returns 참여한 chat-room을 반환한다.
	 */
	async addParticipant(
		userId: number,
		enterChatRoomDto: EnterChatRoomDto
	): Promise<ChatRoomDto> {
		const { roomId } = enterChatRoomDto;
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		if (room.roomType === ChatRoomType.PROTECTED) {
			if (enterChatRoomDto.password !== room.password) {
				throw new UnauthorizedException();
			}
		}
		return this.addParticipants({ roomId, participants: [userId] });
	}

	/**
	 * room id에 해당하는 chat-room을 찾는다.
	 * @param roomId
	 * @returns chat-room을 리턴한다.
	 */
	async getChatRoom(roomId: number): Promise<ChatRoomDto> {
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		if (room === null) {
			throw new NotFoundException();
		}
		return this.roomEntityToDto(
			await this.chatRoomRepository.getChatRoom(roomId),
			null
		);
	}

	/**
	 * 채팅방의 정보를 수정한다.
	 * @param roomId
	 * @param setChatRoomDto
	 * @returns void
	 */
	async setChatRoomInfo(
		userId: number,
		setChatRoomDto: SetChatRoomDto
	): Promise<void> {
		const { roomId } = setChatRoomDto;

		const participant = await this.chatParticipantRepository.getParticipant(
			roomId,
			userId
		);

		if (participant === null || participant.role !== Role.OWNER) {
			throw new UnauthorizedException();
		}

		return this.chatRoomRepository.setChatRoomInfo(roomId, setChatRoomDto);
	}

	/**
	 * 존재하는 채팅방을 삭제한다.
	 * @param roomId
	 * @param userIds
	 * @returns
	 */
	async deleteChatRoom(roomId: number, userId: number): Promise<void> {
		const participant = await this.chatParticipantRepository.getParticipant(
			roomId,
			userId
		);
		if (!participant || participant.role !== Role.OWNER) {
			throw new UnauthorizedException();
		}
		return this.chatRoomRepository.deleteChatRoom(roomId);
	}

	async updateReadTime(roomId: number, userId: number): Promise<void> {
		return this.chatParticipantRepository.updateReadTime(roomId, userId);
	}

	async updateChatRoomUpdateTime(roomId: number): Promise<void> {
		return this.chatRoomRepository.updateChatRoomUpdateTime(roomId);
	}

	/**
	 * 챗을 조회한다.
	 * @param roomId
	 * @param userIds
	 * @returns 챗 리스트를 반환한다.
	 */
	async getChats(roomId: number, userId: number): Promise<ChatDto[]> {
		return this.chatRepository.getChats(roomId);
	}

	/**
	 * 새로운 챗을 전송한다.
	 * @param roomId
	 * @param createChatDto
	 * @returns 생성된 챗을 반환한다.
	 */
	async createChat(
		userId: number,
		createChatDto: CreateChatDto
	): Promise<ChatDto> {
		const { roomId, content } = createChatDto;
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		const participant = await this.chatParticipantRepository.getParticipant(
			roomId,
			userId
		);
		if (participant === null) {
			throw new NotFoundException();
		}
		if (participant.status === PaticipantStatus.MUTED) {
			if (new Date() < participant.muteExpirationTime) {
				throw new UnauthorizedException();
			}
			await this.setParticipantStatus({
				roomId,
				user: participant.user,
				status: PaticipantStatus.DEFAULT,
			});
		}
		return this.chatRepository.createChat(room, participant, content);
	}

	/**
	 * 채팅방에 존재하는 참여자들을 조회한다.
	 * @param roomId
	 * @returns 참여자 리스트를 반환한다.
	 */
	getParticipants(roomId: number): Promise<ChatParticipantDto[]> {
		return this.chatParticipantRepository.getParticipants(roomId);
	}

	/**
	 * 채팅방에 유저들을 추가한다.
	 * @param addParticipantDto
	 * @returns 업데이트된 채팅방을 반환한다.
	 */
	async addParticipants(
		addParticipantDto: AddParticipantDto
	): Promise<ChatRoomDto> {
		const { roomId } = addParticipantDto;
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		const participantIds = addParticipantDto.participants;

		const userList = await this.makeNewParticipantList(room.id, participantIds);
		const [existUserList, mutedUserList] = await this.makeParticipantList(
			room.id,
			participantIds
		);

		await this.chatParticipantRepository.addParticipants(room, userList);
		existUserList.map(
			async (user) =>
				await this.setParticipantStatus({
					roomId,
					user,
					status: PaticipantStatus.DEFAULT,
				})
		);
		mutedUserList.map(
			async (user) =>
				await this.setParticipantStatus({
					roomId,
					user,
					status: PaticipantStatus.MUTED,
				})
		);

		return this.getChatRoom(roomId);
	}

	/**
	 * 참여자를 kick, ban, mute한다.
	 * @param setParticipantDto
	 * @returns void
	 */
	async setParticipantStatus(
		setParticipantDto: SetParticipantStatusDto
	): Promise<ChatRoomDto> {
		const { roomId } = setParticipantDto;
		const participant = await this.chatParticipantRepository.getParticipant(
			roomId,
			setParticipantDto.user.id
		);
		if (participant === null) {
			throw new NotFoundException();
		}

		if (participant.role === Role.OWNER) {
			throw new UnauthorizedException();
		}

		if (setParticipantDto.status === PaticipantStatus.MUTED) {
			const mutedTime = new Date();
			mutedTime.setMinutes(mutedTime.getMinutes() + 5);
			await this.chatParticipantRepository.setParticipantStatus(
				roomId,
				setParticipantDto,
				mutedTime
			);
			return this.getChatRoom(roomId);
		}

		await this.chatParticipantRepository.setParticipantStatus(
			roomId,
			setParticipantDto
		);
		return this.getChatRoom(roomId);
	}

	/**
	 * 참여자의 역할을 변경한다.
	 * @param setParticipantDto
	 * @returns void
	 */
	async setParticipantRole(
		setParticipantDto: SetParticipantRoleDto
	): Promise<ChatRoomDto> {
		const { roomId } = setParticipantDto;
		const participant = await this.chatParticipantRepository.getParticipant(
			roomId,
			setParticipantDto.user.id
		);
		if (participant === null) {
			throw new NotFoundException();
		}

		await this.chatParticipantRepository.setParticipantRole(
			roomId,
			setParticipantDto
		);
		return this.getChatRoom(roomId);
	}

	/**
	 * 유저가 채팅방을 퇴장할 수 있도록 한다.
	 * @param roomId
	 * @param userId
	 * @returns void
	 */
	async deleteParticipant(
		roomId: number,
		userId: number
	): Promise<ChatRoomDto> {
		try {
			const deletedParticipant =
				await this.chatParticipantRepository.deleteParticipant(roomId, userId);

			if (deletedParticipant === null) {
				throw new NotFoundException();
			}
			return this.getChatRoom(roomId);
		} catch (e) {
			throw new UnauthorizedException();
		}
	}
}
