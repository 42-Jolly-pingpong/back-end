import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import {
	IsNotEmpty,
	IsEnum,
	IsNumber,
	Length,
	Min,
	Max,
	ValidateIf,
} from 'class-validator';
export class CreateChatRoomDto {
	@ApiProperty({ description: '채팅방 이름' })
	@IsNotEmpty()
	roomName: string;

	@ApiProperty({ description: '채팅방 타입' })
	@IsEnum(ChatRoomType)
	roomType: ChatRoomType;

	@ApiProperty({ description: '비밀번호' })
	@ValidateIf((room) => room.password != null)
	@IsNumber()
	@Min(1)
	@Max(9999) //
	password: number | null;

	@ApiProperty({ description: '최대 인원' })
	@IsNumber()
	@Min(2)
	@Max(30)
	maxPeople: number;
}
