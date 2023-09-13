import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatRoomDto } from './dto/chat-room.dto';
import { ChatRoomService } from './chat.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Controller('chat-rooms')
export class ChatRoomController {
	constructor(private readonly chatRoomService: ChatRoomService) {}

	@ApiOperation({ summary: '채팅방 생성' })
	@Post('')
	async createChatRoom(
		@Body() createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		return await this.chatRoomService.createChatRoom(createChatRoomDto);
	}
}
