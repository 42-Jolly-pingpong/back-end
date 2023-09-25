import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';

export class ChatRoomDto {
	@ApiProperty({ description: '채팅방 인덱스' })
	id: number;

	@ApiProperty({ description: '채팅방 이름' })
	roomName: string;

	@ApiProperty({ description: '채팅방 타입' })
	roomType: ChatRoomType;

	@ApiProperty({ description: '채팅방 최근 업데이트 시간' })
	updatedTime: Date;

	@ApiProperty({ description: '채팅방 상태' })
	status: boolean;

	@ApiProperty({ description: '채팅방 현재 인원' })
	currentPeople: number;
}
