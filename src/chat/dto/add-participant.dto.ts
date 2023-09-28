import { ApiProperty } from '@nestjs/swagger';

export class AddParticipantDto {
	@ApiProperty({ description: '초대할 유저 리스트' })
	participants: number[];
}
