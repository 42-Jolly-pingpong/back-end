import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
	@ApiProperty({ description: '챗 내용' })
	content: string;
}
