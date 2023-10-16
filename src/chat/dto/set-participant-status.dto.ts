import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { UserDto } from 'src/user/dto/user.dto';

export class SetParticipantStatusDto {
	@ApiProperty({ description: '챗룸 아이디' })
	@IsNotEmpty()
	roomId: number;

	@ApiProperty({ description: '참여자 정보' })
	@IsNotEmpty()
	user: UserDto;

	@ApiProperty({ description: '참여자 상태' })
	@IsEnum(PaticipantStatus)
	status: PaticipantStatus;
}
