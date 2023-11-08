import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddParticipantDto {
	@ApiProperty({ description: '챗룸 아이디' })
	@IsNotEmpty()
	roomId: number;

	@ApiProperty({ description: '초대할 유저 리스트' })
	participants: number[];
}
