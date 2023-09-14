import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatRoomDto } from './dto/chat-room.dto';
import { ChatService } from './chat.service';
import { ChatParticipantService } from './chat-participant.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ChatDto } from './dto/chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatParticipantDto } from './dto/chat-participant.dto';

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

	@ApiOperation({ summary: '채팅방 정보 조회' })
	@Get('/:roomIdx')
	getChatRoomInfo(@Param('roomIdx') roomIdx: number): Promise<ChatRoomDto> {
		return this.chatService.getChatRoomInfo(roomIdx);
	}

	@ApiOperation({ summary: '채팅방 정보 수정' })
	@Put('/:roomIdx')
	setChatRoomInfo(
		@Param('roomIdx') roomIdx: number,
		@Body() createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		return this.chatService.setChatRoomInfo(roomIdx, createChatRoomDto);
	}

	@ApiOperation({ summary: '채팅방 삭제' })
	@Delete('/:roomIdx')
	deleteChatRoom(@Param('roomIdx') roomIdx: number): Promise<void> {
		return this.chatService.deleteChatRoom(roomIdx);
	}

	@ApiOperation({ summary: '채팅방 내부 챗 조회' })
	@Get('/:roomIdx/chats')
	getChats(@Param('roomIdx') roomIdx: number): Promise<ChatDto[]> {
		return this.chatService.getChats(roomIdx);
	}

	@ApiOperation({ summary: '챗 생성' })
	@Post('/:roomIdx/chats')
	createChat(
		@Param('roomIdx') roomIdx: number,
		@Body() createChatDto: CreateChatDto
	): Promise<ChatDto> {
		return this.chatService.createChat(roomIdx, createChatDto);
	}

	@ApiOperation({ summary: '채팅방 참여자 목록 조회' })
	@Get('/:roomIdx/members')
	getPariticipants(
		@Param('roomIdx') roomIdx: number
	): Promise<ChatParticipantDto[]> {
		return this.chatService.getPariticipants(roomIdx);
	}
}
