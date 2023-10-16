import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import {
	IsNotEmpty,
	IsEnum,
	ValidateIf,
	IsHash,
	NotEquals,
} from 'class-validator';

export class SetChatRoomDto {
	@ApiProperty({ description: '챗룸 아이디' })
	@IsNotEmpty()
	roomId: number;

	@ApiProperty({ description: '채팅방 이름' })
	@IsNotEmpty()
	roomName: string;

	@ApiProperty({ description: '채팅방 타입' })
	@IsEnum(ChatRoomType)
	@NotEquals(ChatRoomType.DM)
	roomType: ChatRoomType;

	@ApiProperty({ description: '비밀번호' })
	@ValidateIf((room) => room.roomType === ChatRoomType.PROTECTED)
	@IsNotEmpty()
	@IsHash('sha256')
	password: string | null;
}
