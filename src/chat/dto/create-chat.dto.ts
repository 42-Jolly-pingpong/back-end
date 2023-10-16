import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
	@ApiProperty({ description: '챗 내용' })
	@IsNotEmpty()
	content: string;

	@ApiProperty({ description: '챗룸 아이디' })
	@IsNotEmpty()
	roomId: number;
}
