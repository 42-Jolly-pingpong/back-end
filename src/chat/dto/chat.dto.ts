import { ApiProperty } from '@nestjs/swagger';
import { ChatParticipantDto } from 'src/chat/dto/chat-participant.dto';

export class ChatDto {
	@ApiProperty({ description: '챗 인덱스' })
	id: number;

	@ApiProperty({ description: '챗 보낸 사람' })
	user: ChatParticipantDto;

	@ApiProperty({ description: '챗 내용' })
	content: string;

	@ApiProperty({ description: '보낸 시간' })
	sentTime: Date;
}
