import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatRoomDto } from './dto/chat-room.dto';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Controller('chat-rooms')
export class ChatRoomController {
	constructor(private readonly chatRoomService: ChatRoomService) {}

	@ApiOperation({ summary: '채팅방 생성' })
	@Post('')
	async createChatRoom(
		@Param() createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		return await this.chatRoomService.createChatRoom(createChatRoomDto);
	}
}
