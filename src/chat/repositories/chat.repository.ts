import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
	constructor(private dataSource: DataSource) {
		super(Chat, dataSource.createEntityManager());
	}
}
