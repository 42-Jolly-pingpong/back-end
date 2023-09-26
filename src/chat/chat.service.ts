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
import { EnterChatRoomDto } from 'src/chat/dto/enter-chat-room.dto';
import { GetDMDto } from 'src/chat/dto/get-DM.dto';
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
	 * @returns 변환된 Dto 배열을 반환한다.
	 */
	roomsEntityToDto(rooms: ChatRoom[]): ChatRoomDto[] {
		return rooms.map((room) => {
			return this.roomEntityToDto(room);
		});
	}

	/**
	 * entity에는 없지만 dto에는 존재하는 currentPeople값을 생성한 후 dto로 변환한다.
	 * participants리스트를 이용해 currentPeople을 계산한다.
	 * @param room dto로 변경할 ChatRoom entity.
	 * @returns 변경된 dto를 반환한다.
	 */
	roomEntityToDto(room: ChatRoom): ChatRoomDto {
		const dto: ChatRoomDto = {
			id: room.id,
			roomName: room.roomName,
			roomType: room.roomType,
			updatedTime: room.updatedTime,
			status: room.status,
			currentPeople: room.participants.filter(
				(participant) =>
					participant.status === PaticipantStatus.DEFAULT ||
					participant.status === PaticipantStatus.MUTED
			).length,
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
		if (room == null) {
			return false;
		}
		return true;
	}

	/**
	 * 유저가 room에 참여하고있는지 확인한다.
	 * @param participants 확인할 room의 participant목록
	 * @param user 참여해있는지 확인할 user
	 * @returns 참여자하면 true, 참여자가 아니라면 false를 반환한다.
	 */
	checkUserInParticipant(participants: ChatParticipant[], user: User): boolean {
		return participants.some((participant) => participant.user.id === user.id);
	}

	/**
	 * 채팅방 참가자의 상태를 확인한다.
	 * @param participants
	 * @param user
	 * @returns 참가자의 상태를 반환한다.
	 */
	getParticipantStatus(
		participants: ChatParticipant[],
		user: User
	): PaticipantStatus {
		const participant = participants.find((participant) => {
			if (participant.user.id == user.id) {
				return participant;
			}
		});
		//참여자 아닌 경우
		return participant.status;
	}

	/**
	 * dm방을 반환한다.
	 * @param getPrivateChatRoomDto 대화를 나눌 유저의 정보가 담긴 dto
	 * @returns dm room을 반환한다.
	 */
	async getDM(getDMDto: GetDMDto): Promise<ChatRoomDto> {
		const user = await this.userRepository.getUserInfobyIdx(1); //temp
		const chatMateId = getDMDto.chatMate.id;
		if (user.id == chatMateId) {
			throw new ConflictException();
		}
		const chatMate = await this.userRepository.getUserInfobyIdx(chatMateId);
		if (chatMate == null) {
			throw new NotFoundException();
		}

		const roomName = this.createDMName(user.id, chatMateId);
		const room = await this.chatRoomRepository.getDM(roomName);
		if (room != null) {
			return this.roomEntityToDto(room);
		}
		return this.createDM(user, chatMate);
	}

	/**
	 * dm방에 참여 중인 두 유저의 id를 이용해 private방의 제목을 생성한다.
	 * @param userId
	 * @param chatMateId
	 * @returns roomName을 반환한다.
	 */
	createDMName(userId: number, chatMateId: number): string {
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
	async createDM(user: User, chatMate: User): Promise<ChatRoomDto> {
		const roomName = this.createDMName(user.id, chatMate.id);
		const emptyRoom = await this.chatRoomRepository.createDM(roomName);
		await this.chatParticipantRepository.createDM(emptyRoom, user, chatMate);
		const room = await this.chatRoomRepository.getChatRoom(emptyRoom.id);
		return this.roomEntityToDto(room);
	}

	/**
	 * user들의 id가 담긴 리스트를 받아 UserDto의 리스트로 변환한다.
	 * @param ids
	 * @returns UserDto의 리스트를 반환한다.
	 */
	async makeUserList(ids: number[]): Promise<UserDto[]> {
		const users: UserDto[] = [];

		for (const id of ids) {
			const user = await this.userRepository.findUserById(id);
			if (user !== null) {
				users.push(user);
			}
		}

		return users;
	}

	/**
	 * 새로운 chat-room을 생성한 후, owner가 초대한 유저들을 참가자로 추가한다.
	 * @param createChatRoomDto
	 * @returns 생성된 chat-room을 반환한다.
	 */
	async createChatRoom(
		createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		const emptyRoom = await this.chatRoomRepository.createChatRoom(
			createChatRoomDto
		);
		const user = await this.userRepository.findUserById(1); //temp

		const participantIds = createChatRoomDto.participants;

		const index = participantIds.indexOf(user.id);
		if (index !== -1) {
			participantIds.splice(index, 1);
		} // 초대를 받은 유저 중 owner와 같은 id를 가진 유저가 있다면 지운다.

		const userList = await this.makeUserList(participantIds);

		await this.chatParticipantRepository.createChatRoom(
			emptyRoom,
			user,
			userList
		);

		const room = await this.chatRoomRepository.getChatRoom(emptyRoom.id);
		return this.roomEntityToDto(room);
	}

	/**
	 * 유저가 참여하고있는 모든 chat-room을 조회한다.
	 * @param userId
	 * @returns 참여하고있는 chat-room 리스트를 반환한다.
	 */
	async inquireChatRoom(userId: number): Promise<ChatRoomDto[]> {
		const user = await this.userRepository.findUserById(userId); //temp

		return this.roomsEntityToDto(
			await this.chatParticipantRepository.inquireChatRoom(user)
		);
	}

	/**
	 * 존재하는 오픈 채팅방을 조회한다.
	 * @returns 존재하는 오픈 채팅방 리스트를 반환한다.
	 */
	async inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		return this.roomsEntityToDto(
			await this.chatRoomRepository.inquireOpenedChatRoom()
		);
	}

	/**
	 * 존재하는 채팅방에 새로운 유저를 입장시킨다.
	 * @param roomId 참여할 방의 id
	 * @param enterChatRoomDto
	 * @returns 참여한 chat-room을 반환한다.
	 */
	async addParticipant(
		roomId: number,
		enterChatRoomDto: EnterChatRoomDto
	): Promise<ChatRoomDto> {
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		if (
			room.roomType == ChatRoomType.PROTECTED &&
			enterChatRoomDto.password != null
		) {
			if (enterChatRoomDto.password != room.password) {
				throw new UnauthorizedException();
			}
		}
		const user = await this.userRepository.findUserById(1); //temp
		if (this.checkUserInParticipant(room.participants, user)) {
			throw new ConflictException();
		}

		await this.chatParticipantRepository.addParticipant(room, user);
		return this.roomEntityToDto(room);
	}

	/**
	 * room id에 해당하는 chat-room을 찾는다.
	 * @param roomId
	 * @returns chat-room을 리턴한다.
	 */
	async getChatRoom(roomId: number): Promise<ChatRoomDto> {
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		if (room == null) {
			throw new NotFoundException();
		}
		return this.roomEntityToDto(
			await this.chatRoomRepository.getChatRoom(roomId)
		);
	}

	/**
	 * 채팅방의 정보를 수정한다.
	 * @param roomId
	 * @param createChatRoomDto
	 * @returns void
	 */
	async setChatRoomInfo(
		roomId: number,
		createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		return this.chatRoomRepository.setChatRoomInfo(roomId, createChatRoomDto);
	}

	/**
	 * 존재하는 채팅방을 삭제한다.
	 * @param roomId
	 * @returns
	 */
	deleteChatRoom(roomId: number): Promise<void> {
		return this.chatRoomRepository.deleteChatRoom(roomId);
	}

	/**
	 * 챗을 조회한다.
	 * @param roomId
	 * @returns 챗 리스트를 반환한다.
	 */
	getChats(roomId: number): Promise<ChatDto[]> {
		return this.chatRepository.getChats(roomId);
	}

	/**
	 * 새로운 챗을 전송한다.
	 * @param roomId
	 * @param createChatDto
	 * @returns 생성된 챗을 반환한다.
	 */
	async createChat(
		roomId: number,
		createChatDto: CreateChatDto
	): Promise<ChatDto> {
		const room = await this.chatRoomRepository.getChatRoom(roomId);
		const participant = await this.chatParticipantRepository.getParticipant(
			roomId,
			1
		); //userId temp
		if (participant == null) {
			throw new NotFoundException();
		}

		return this.chatRepository.createChat(room, participant, createChatDto);
	}

	/**
	 * 채팅방에 존재하는 참여자들을 조회한다.
	 * @param roomId
	 * @returns 참여자 리스트를 반환한다.
	 */
	getPariticipants(roomId: number): Promise<ChatParticipantDto[]> {
		return this.chatParticipantRepository.getPariticipants(roomId);
	}

	/**
	 * 참여자를 kick, ban, mute한다.
	 * @param roomId
	 * @param setParticipantDto
	 * @returns void
	 */
	async setParticipantStatus(
		roomId: number,
		setParticipantDto: SetParticipantStatusDto
	): Promise<void> {
		const participant = await this.chatParticipantRepository.getParticipant(
			roomId,
			setParticipantDto.user.id
		);
		if (participant == null) {
			throw new NotFoundException();
		}

		if (participant.role == Role.OWNER) {
			throw new UnauthorizedException();
		}

		if (setParticipantDto.status == PaticipantStatus.MUTED) {
			const mutedTime = new Date();
			mutedTime.setMinutes(mutedTime.getMinutes() + 5);
			return this.chatParticipantRepository.setParticipantStatus(
				roomId,
				setParticipantDto,
				mutedTime
			);
		}

		return this.chatParticipantRepository.setParticipantStatus(
			roomId,
			setParticipantDto
		);
	}

	/**
	 * 참여자의 역할을 변경한다.
	 * @param roomId
	 * @param setParticipantDto
	 * @returns void
	 */
	async setParticipantRole(
		roomId: number,
		setParticipantDto: SetParticipantRoleDto
	): Promise<void> {
		const participant = await this.chatParticipantRepository.getParticipant(
			roomId,
			setParticipantDto.user.id
		);
		if (participant == null) {
			throw new NotFoundException();
		}

		return this.chatParticipantRepository.setParticipantRole(
			roomId,
			setParticipantDto
		);
	}

	/**
	 * 유저가 채팅방을 퇴장할 수 있도록 한다.
	 * @param roomId
	 * @param userId
	 * @returns void
	 */
	async deleteParticipant(roomId: number, userId: number): Promise<void> {
		const deletedParticipant =
			await this.chatParticipantRepository.deleteParticipant(roomId, userId);

		if (deletedParticipant == null) {
			throw new NotFoundException();
		}
	}
}
