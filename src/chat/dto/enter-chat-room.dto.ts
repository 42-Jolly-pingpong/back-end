import { ApiProperty } from '@nestjs/swagger';

export class EnterChatRoomDto {
	@ApiProperty({ description: '비밀번호' })
	password: string | null;
}
