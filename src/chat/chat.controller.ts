import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/user-info';
import { AuthJwtGuard } from 'src/auth/guards/jwt-guard';
import { ChatService } from 'src/chat/chat.service';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';
import { ChatRoomDto } from 'src/chat/dto/chat-room.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { DmDto } from 'src/chat/dto/dm.dto';
import { GetDmDto } from 'src/chat/dto/get-dm.dto';
import { RoomGuard } from 'src/chat/guards/room.guard';
import { User } from 'src/user/entities/user.entity';

@ApiTags('chat-controller')
@Controller('chat-rooms')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@ApiOperation({ summary: '사용자가 참여하고있는 채팅방 목록 조회' })
	@Get('')
	@UseGuards(AuthJwtGuard)
	async inquireJoinedChannels(@GetUser() user: User): Promise<ChatRoomDto[]> {
		return await this.chatService.inquireJoinedChannels(user.id);
	}

	@ApiOperation({ summary: 'dm 채팅방 리스트 조회' })
	@Get('/dm')
	@UseGuards(AuthJwtGuard)
	@UsePipes(ValidationPipe)
	async inquireDms(@GetUser() user: User): Promise<DmDto[]> {
		return await this.chatService.inquireDms(user.id);
	}

	@ApiOperation({ summary: '상대방과의 dm 채팅방 반환' })
	@Post('/dm')
	@UseGuards(AuthJwtGuard)
	@UsePipes(ValidationPipe)
	async createNewDm(
		@GetUser() user: User,
		@Body() getDmDto: GetDmDto
	): Promise<DmDto> {
		return await this.chatService.getDm(getDmDto, user);
	}

	@ApiOperation({ summary: '오픈 채팅방 목록 조회' })
	@Get('/opened')
	@UseGuards(AuthJwtGuard)
	async inquireOpenedChatRoom(@GetUser() user: User): Promise<ChatRoomDto[]> {
		return await this.chatService.inquireOpenedChatRoom(user);
	}

	@ApiOperation({ summary: '채팅방 정보 조회' })
	@Get('/:roomId')
	@UseGuards(AuthJwtGuard, RoomGuard)
	async getChatRoomInfo(
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatRoomDto> {
		return await this.chatService.getChatRoom(roomId);
	}

	@ApiOperation({ summary: '채팅방 내부 챗 조회' })
	@Get('/:roomId/chats')
	@UseGuards(AuthJwtGuard, RoomGuard)
	async getChats(
		@GetUser() user: User,
		@Param('roomId', ParseIntPipe) roomId: number
	): Promise<ChatDto[]> {
		return await this.chatService.getChats(roomId, user.id);
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
