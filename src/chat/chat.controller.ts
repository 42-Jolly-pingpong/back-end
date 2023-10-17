import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from 'src/chat/chat.service';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { DmDto } from 'src/chat/dto/dm.dto';
import { RoomGuard } from 'src/chat/guards/room.guard';

@ApiTags('chat-controller')
@Controller('chat-rooms')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@ApiOperation({ summary: '사용자가 참여하고있는 채팅방 목록 조회' })
	@Get('')
	async inquireJoinedChannels(): Promise<ChatRoomDto[]> {
		return await this.chatService.inquireJoinedChannels(0); //temp
	}

	@ApiOperation({ summary: 'dm 채팅방 리스트 조회' })
	@Get('/dm')
	@UsePipes(ValidationPipe)
	async inquireDms(): Promise<DmDto[]> {
		return await this.chatService.inquireDms(0); //temp
	}

	@ApiOperation({ summary: '오픈 채팅방 목록 조회' })
	@Get('/opened')
	async inquireOpenedChatRoom(): Promise<ChatRoomDto[]> {
		return await this.chatService.inquireOpenedChatRoom(0); //temp
	}

	@ApiOperation({ summary: '채팅방 정보 조회' })
	@Get('/:roomId')
	@UseGuards(RoomGuard)
	async getChatRoomInfo(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatRoomDto> {
		return await this.chatService.getChatRoom(roomId);
	}

	@ApiOperation({ summary: '채팅방 내부 챗 조회' })
	@Get('/:roomId/chats')
	@UseGuards(RoomGuard)
	async getChats(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatDto[]> {
		return await this.chatService.getChats(roomId, 0); //temp
	}

	@ApiOperation({ summary: '채팅방 참여자 목록 조회' })
	@Get('/:roomId/members')
	@UseGuards(RoomGuard)
	async getParticipants(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatParticipantDto[]> {
		return await this.chatService.getParticipants(roomId);
	}
}
