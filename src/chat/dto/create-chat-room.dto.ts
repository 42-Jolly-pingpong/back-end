import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import {
	IsNotEmpty,
	IsEnum,
	ValidateIf,
	IsHash,
	NotEquals,
} from 'class-validator';

export class CreateChatRoomDto {
	@ApiProperty({ description: '채팅방 이름' })
	@IsNotEmpty()
	roomName: string;

	@ApiProperty({ description: '채팅방 타입' })
	@IsEnum(ChatRoomType)
	@NotEquals(ChatRoomType.PRIVATE)
	roomType: ChatRoomType;

	@ApiProperty({ description: '비밀번호' })
	@ValidateIf((room) => room.roomType == ChatRoomType.PROTECTED)
	@IsNotEmpty()
	// @IsHash()
	password: number | null;
}
