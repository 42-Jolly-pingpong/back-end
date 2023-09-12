import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';

@Injectable()
export class ChatRoomRepository extends Repository<ChatRoom> {
	constructor(private dataSource: DataSource) {
		super(ChatRoom, dataSource.createEntityManager());
	}
}
