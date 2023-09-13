import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaticipantStatus } from '../enums/paticipant-status.enum';
import { RoomAuth } from '../enums/room-auth.enum';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
	constructor(private dataSource: DataSource) {
		super(Chat, dataSource.createEntityManager());
	}
}
