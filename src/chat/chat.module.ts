import { Module } from '@nestjs/common';
import { ChatRoomController } from './chat.controller';
import { ChatRoomService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatRoomRepository } from './repositories/chat-room.repository';

@Module({
	imports: [TypeOrmModule.forFeature([ChatRoom])],
	controllers: [ChatRoomController],
	providers: [ChatRoomService, ChatRoomRepository],
})
export class ChatRoomModule {}
