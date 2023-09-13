import {
	Body,
	Controller,
	Get,
	Logger,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatRoomDto } from './dto/chat-room.dto';
import { ChatService } from './chat.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Controller('chat-rooms')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@ApiOperation({ summary: '채팅방 생성' })
	@Post('')
	createChatRoom(
		@Body() createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		return this.chatService.createChatRoom(createChatRoomDto);
	}

	@ApiOperation({ summary: '오픈 채팅방 목록 조회' })
	@Get('/opened')
	inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		return this.chatService.inquireOpenedChatRoom();
	}

	@Get('/:roomIdx')
	getChatRoomInfo(@Param('roomIdx') roomIdx: number): Promise<ChatRoomDto> {
		return this.chatService.getChatRoomInfo(roomIdx);
	}

	@Put('/:roomIdx')
	setChatRoomInfo(
		@Param('roomIdx') roomIdx: number,
		@Body() createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		return this.chatService.setChatRoomInfo(roomIdx, createChatRoomDto);
	}
}
