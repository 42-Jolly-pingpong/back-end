import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatParticipantRepository } from 'src/chat/repositories/chat-participant.repository';
import { ChatRoomRepository } from 'src/chat/repositories/chat-room.repository';
import { ChatRepository } from 'src/chat/repositories/chat.repository';
import { UserRepository } from 'src/user/user.repository';
import { ChatGateway } from './chat.gateway';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ChatRoom, ChatParticipant, Chat]),
		AuthModule,
	],
	controllers: [ChatController],
	providers: [
		ChatService,
		AuthService,
		ChatRoomRepository,
		ChatParticipantRepository,
		ChatRepository,
		UserRepository,
		ChatGateway,
	],
})
export class ChatModule {}
