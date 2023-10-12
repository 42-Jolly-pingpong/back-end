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
import { AddParticipantDto } from 'src/chat/dto/add-participant.dto';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { CreateChatRoomDto } from 'src/chat/dto/create-chat-room.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { DmDto } from 'src/chat/dto/dm.dto';
import { EnterChatRoomDto } from 'src/chat/dto/enter-chat-room.dto';
import { GetDmDto } from 'src/chat/dto/get-dm.dto';
import { SetParticipantRoleDto } from 'src/chat/dto/set-participant-role.dto';
import { SetParticipantStatusDto } from 'src/chat/dto/set-participant-status.dto';
import { RoomGuard } from 'src/chat/guards/room.guard';

@ApiTags('chat-controller')
@Controller('chat-rooms')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@ApiOperation({ summary: '사용자가 참여하고있는 채팅방 목록 조회' })
	@Get('')
	async inquireChatRoom(): Promise<ChatRoomDto[]> {
		return await this.chatService.inquireChatRoom(0); //temp
	}

	@ApiOperation({ summary: '채팅방 생성' })
	@Post('')
	@UsePipes(ValidationPipe)
	async createChatRoom(
		@Body() createChatRoomDto: CreateChatRoomDto
	): Promise<ChatRoomDto> {
		return await this.chatService.createChatRoom(createChatRoomDto);
	}

	@ApiOperation({ summary: 'dm 채팅방 리스트 조회' })
	@Get('/dm')
	@UsePipes(ValidationPipe)
	async inquireDm(): Promise<DmDto[]> {
		return await this.chatService.inquireDm(0); //temp
	}

	@ApiOperation({ summary: 'dm 채팅방 입장' })
	@Post('/dm')
	@UsePipes(ValidationPipe)
	async getDm(@Body() getDmDto: GetDmDto): Promise<DmDto> {
		return await this.chatService.getDm(getDmDto);
	}

	@ApiOperation({ summary: '오픈 채팅방 목록 조회' })
	@Get('/opened')
	async inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		return await this.chatService.inquireOpenedChatRoom(0); //temp
	}

	@ApiOperation({ summary: '채팅방 입장' })
	@Post('/:roomId')
	@UseGuards(RoomGuard)
	async addParticipant(
		@Param('roomId') roomId: number,
		@Body() enterChatRoomDto: EnterChatRoomDto
	): Promise<ChatRoomDto> {
		return await this.chatService.addParticipant(roomId, 0, enterChatRoomDto); //temp
	}

	@ApiOperation({ summary: '채팅방 정보 조회' })
	@Get('/:roomId')
	@UseGuards(RoomGuard)
	async getChatRoomInfo(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatRoomDto> {
		return await this.chatService.getChatRoom(roomId);
	}

	@ApiOperation({ summary: '채팅방 정보 수정' })
	@Put('/:roomId')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async setChatRoomInfo(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() createChatRoomDto: CreateChatRoomDto
	): Promise<void> {
		return await this.chatService.setChatRoomInfo(roomId, createChatRoomDto);
	}

	@ApiOperation({ summary: '채팅방 삭제' })
	@Delete('/:roomId')
	@UseGuards(RoomGuard)
	async deleteChatRoom(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<void> {
		return await this.chatService.deleteChatRoom(roomId, 0); //temp
	}

	@ApiOperation({ summary: '채팅방 내부 챗 조회' })
	@Get('/:roomId/chats')
	@UseGuards(RoomGuard)
	async getChats(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatDto[]> {
		return await this.chatService.getChats(roomId);
	}

	@ApiOperation({ summary: '챗 생성' })
	@Post('/:roomId/chats')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async createChat(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() createChatDto: CreateChatDto
	): Promise<ChatDto> {
		return await this.chatService.createChat(roomId, 0, createChatDto); //temp
	}

	@ApiOperation({ summary: '채팅방 참여자 목록 조회' })
	@Get('/:roomId/members')
	@UseGuards(RoomGuard)
	async getParticipants(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatParticipantDto[]> {
		return await this.chatService.getParticipants(roomId);
	}

	@ApiOperation({ summary: '채팅방 참여자 추가' })
	@Post('/:roomId/members')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async addParticipants(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() addParticipantDto: AddParticipantDto
	): Promise<ChatRoomDto> {
		return await this.chatService.addParticipants(roomId, addParticipantDto);
	}

	@ApiOperation({ summary: '채팅방 역할 변경' })
	@Patch('/:roomId/members/role')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async setParticipantRole(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() chatParticipantDto: SetParticipantRoleDto
	): Promise<ChatRoomDto> {
		return await this.chatService.setParticipantRole(
			roomId,
			chatParticipantDto
		);
	}

	@ApiOperation({ summary: '채팅방 참여자 상태 변경' })
	@Patch('/:roomId/members/status')
	@UseGuards(RoomGuard)
	@UsePipes(ValidationPipe)
	async setParticipantStatus(
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() chatParticipantDto: SetParticipantStatusDto
	): Promise<ChatRoomDto> {
		return await this.chatService.setParticipantStatus(
			roomId,
			chatParticipantDto
		);
	}

	@ApiOperation({ summary: '참여자 채팅방 퇴장' })
	@Delete('/:roomId/members')
	@UseGuards(RoomGuard)
	async deleteParticipant(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatRoomDto> {
		return await this.chatService.deleteParticipant(roomId, 0); //temp
	}
}
