import { Module } from '@nestjs/common';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';

@Module({
  controllers: [ChatRoomController],
  providers: [ChatRoomService]
})
export class ChatRoomModule {}
