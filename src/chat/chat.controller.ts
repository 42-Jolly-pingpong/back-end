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
import { ChatService } from 'src/chat/chat.service';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

@Controller('chat-rooms')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@ApiOperation({ summary: '채팅방 목록 조회' })
	@Get('')
	inquireChatRoom(): Promise<ChatRoomDto[]> {
		return this.chatService.inquireChatRoom(2); //temp
	}

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

	@ApiOperation({ summary: '채팅방 입장' })
	@Post('/:roomIdx')
	addParticipant(@Param('roomIdx') roomIdx: number): Promise<ChatRoomDto> {
		return this.chatService.addParticipant(roomIdx);
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

	@ApiOperation({ summary: '채팅방 참여자 상태, 역할 변경' })
	@Patch('/:roomIdx/members')
	setParticipantInfo(
		@Param('roomIdx') roomIdx: number,
		@Body() chatParticipantDto: ChatParticipantDto
	): Promise<void> {
		return this.chatService.setParticipantInfo(roomIdx, chatParticipantDto);
	}

	@ApiOperation({ summary: '참여자 채팅방 퇴장' })
	@Delete('/:roomIdx/members')
	deleteParticipant(@Param('roomIdx') roomIdx: number): Promise<void> {
		return this.chatService.deleteParticipant(roomIdx, 1); //temp
	}
}
