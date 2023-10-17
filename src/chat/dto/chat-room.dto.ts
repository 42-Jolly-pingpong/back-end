import { ApiProperty } from '@nestjs/swagger';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';

export class ChatRoomDto {
	@ApiProperty({ description: '채팅방 인덱스' })
	id: number;

	@ApiProperty({ description: '채팅방 이름' })
	roomName: string;

	@ApiProperty({ description: '채팅방 타입' })
	roomType: ChatRoomType;

	@ApiProperty({ description: '채팅방 생성 시간' })
	createdAt: Date;

	@ApiProperty({ description: '채팅방 최근 업데이트 시간' })
	updatedTime: Date;

	@ApiProperty({ description: '채팅방 상태' })
	status: boolean;

	@ApiProperty({ description: '채팅방 현재 인원' })
	currentPeople: number;

	@ApiProperty({ description: '채팅방 참가자 목록' })
	participants: ChatParticipant[];

	@ApiProperty({ description: '읽어야하는 챗 있는 지 유무' })
	leftToRead: boolean;
}
