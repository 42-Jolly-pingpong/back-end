import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EnterChatRoomDto {
	@ApiProperty({ description: '챗룸 아이디' })
	@IsNotEmpty()
	roomId: number;

	@ApiProperty({ description: '비밀번호' })
	password: string | null;
}
