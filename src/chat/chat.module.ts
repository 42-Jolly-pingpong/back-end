import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatRoomRepository } from './repositories/chat-room.repository';
import { ChatParticipantRepository } from './repositories/chat-participant.repository copy';
import { ChatParticipant } from './entities/chat-participant.entity';
import { Chat } from './entities/chat.entity';
import { ChatRepository } from './repositories/chat.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
	imports: [TypeOrmModule.forFeature([ChatRoom, ChatParticipant, Chat])],
	controllers: [ChatController],
	providers: [
		ChatService,
		ChatRoomRepository,
		ChatParticipantRepository,
		ChatRepository,
		UserRepository,
	],
})
export class ChatModule {}
