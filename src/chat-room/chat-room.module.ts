import { Module } from '@nestjs/common';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatRoomRepository } from './chat-room.repository';

@Module({
	imports: [TypeOrmModule.forFeature([ChatRoom])],
	controllers: [ChatRoomController],
	providers: [ChatRoomService, ChatRoomRepository],
})
export class ChatRoomModule {}
