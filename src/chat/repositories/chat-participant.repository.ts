import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatParticipant } from '../entities/chat-participant.entity';
import { PaticipantStatus } from '../enums/paticipant-status.enum';
import { RoomAuth } from '../enums/room-auth.enum';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';

@Injectable()
export class ChatParticipantRepository extends Repository<ChatParticipant> {
	constructor(private dataSource: DataSource) {
		super(ChatParticipant, dataSource.createEntityManager());
	}

	async createChatRoom(room: ChatRoomDto, user: UserInfoDTO) {
		const participant = this.create({
			room,
			user,
			roomAuth: RoomAuth.OWNER,
			status: PaticipantStatus.DEFAULT,
			muteExpirationTime: null,
		});

		await this.save(participant);
	}
}
