import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import { User } from 'src/user/entities/user.entity';

export class DmDto {
	@ApiProperty({ description: '채팅방 인덱스' })
	id: number;

	@ApiProperty({ description: '채팅방 타입' })
	roomType: ChatRoomType;

	@ApiProperty({ description: '디엠 상대방' })
	chatMate: User;

	@ApiProperty({ description: '채팅방 최근 업데이트 시간' })
	updatedTime: Date;

	@ApiProperty({ description: '채팅방 상태' })
	status: boolean;

	@ApiProperty({ description: '읽어야하는 챗 있는 지 유무' })
	leftToRead: boolean;
}
