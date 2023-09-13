import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from '../enums/chat-room-type.enum';

export class CreateChatRoomDto {
	@ApiProperty({ description: '채팅방 이름' })
	roomName: string;

	@ApiProperty({ description: '채팅방 타입' })
	roomType: ChatRoomType;

	@ApiProperty({ description: '비밀번호' })
	password: number | null;

	@ApiProperty({ description: '최대 인원' })
	maxPeople: number;
}
