import {
	Body,
	Controller,
	Delete,
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
import { ChatDto } from './dto/chat.dto';

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

	@Delete('/:roomIdx')
	deleteChatRoom(@Param('roomIdx') roomIdx: number): Promise<void> {
		return this.chatService.deleteChatRoom(roomIdx);
	}

	@Get('/:roomIdx/chats')
	getChats(@Param('roomIdx') roomIdx: number): Promise<ChatDto[]> {
		return this.chatService.getChats(roomIdx);
	}
}
