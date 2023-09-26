import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from 'src/chat/chat.service';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { EnterChatRoomDto } from 'src/chat/dto/enter-chat-room.dto';
import { GetDMDto } from 'src/chat/dto/get-DM.dto';
import { SetParticipantRoleDto } from 'src/chat/dto/set-participant-role.dto';
import { SetParticipantStatusDto } from 'src/chat/dto/set-participant-status.dto';
import { RoomGuard } from 'src/chat/guards/room.guard';

@ApiTags('chat-controller')
@Controller('chat-rooms')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@ApiOperation({ summary: '사용자가 참여하고있는 채팅방 목록 조회' })
	@Get('')
	inquireChatRoom(): Promise<ChatRoomDto[]> {
		return this.chatService.inquireChatRoom(2); //temp
	}

	@ApiOperation({ summary: '채팅방 생성' })
	@Post('')
	@UsePipes(ValidationPipe)
	createChatRoom(
		@Body() createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		return this.chatService.createChatRoom(createChatRoomDto);
	}

	@ApiOperation({ summary: 'dm 채팅방 입장' })
	@Post('/dm')
	@UsePipes(ValidationPipe)
	getDM(@Body() getDMDto: GetDMDto): Promise<ChatRoomDto> {
		return this.chatService.getDM(getDMDto);
	}

	@ApiOperation({ summary: '오픈 채팅방 목록 조회' })
	@Get('/opened')
	inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		return this.chatService.inquireOpenedChatRoom();
	}

	@ApiOperation({ summary: '채팅방 입장' })
	@Post('/:roomId')
	@UseGuards(RoomGuard)
	addParticipant(
		@Param('roomId') roomId: number,
		@Body() enterChatRoomDto: EnterChatRoomDto
	): Promise<ChatRoomDto> {
		return this.chatService.addParticipant(roomId, enterChatRoomDto);
	}

	@ApiOperation({ summary: '채팅방 정보 조회' })
	@Get('/:roomId')
	@UseGuards(RoomGuard)
	getChatRoomInfo(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatRoomDto> {
		return this.chatService.getChatRoom(roomId);
	}

	@ApiOperation({ summary: '채팅방 정보 수정' })
	@Put('/:roomId')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	setChatRoomInfo(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		return this.chatService.setChatRoomInfo(roomId, createChatRoomDto);
	}

	@ApiOperation({ summary: '채팅방 삭제' })
	@Delete('/:roomId')
	@UseGuards(RoomGuard)
	deleteChatRoom(@Param('roomId', ParseIntPipe) roomId: number): Promise<void> {
		return this.chatService.deleteChatRoom(roomId);
	}

	@ApiOperation({ summary: '채팅방 내부 챗 조회' })
	@Get('/:roomId/chats')
	@UseGuards(RoomGuard)
	getChats(@Param('roomId', ParseIntPipe) roomId: number): Promise<ChatDto[]> {
		return this.chatService.getChats(roomId);
	}

	@ApiOperation({ summary: '챗 생성' })
	@Post('/:roomId/chats')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	createChat(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() createChatDto: CreateChatDto
	): Promise<ChatDto> {
		return this.chatService.createChat(roomId, createChatDto);
	}

	@ApiOperation({ summary: '채팅방 참여자 목록 조회' })
	@Get('/:roomId/members')
	@UseGuards(RoomGuard)
	getPariticipants(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatParticipantDto[]> {
		return this.chatService.getPariticipants(roomId);
	}

	@ApiOperation({ summary: '채팅방 역할 변경' })
	@Patch('/:roomId/members/role')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	setParticipantRole(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() chatParticipantDto: SetParticipantRoleDto
	): Promise<void> {
		return this.chatService.setParticipantRole(roomId, chatParticipantDto);
	}

	@ApiOperation({ summary: '채팅방 참여자 상태 변경' })
	@Patch('/:roomId/members/status')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	setParticipantStatus(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() chatParticipantDto: SetParticipantStatusDto
	): Promise<void> {
		return this.chatService.setParticipantStatus(roomId, chatParticipantDto);
	}

	@ApiOperation({ summary: '참여자 채팅방 퇴장' })
	@Delete('/:roomId/members')
	@UseGuards(RoomGuard)
	deleteParticipant(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<void> {
		return this.chatService.deleteParticipant(roomId, 1); //temp
	}
}
