import { Role } from 'src/chat/enums/role.enum';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';

export class SetParticipantDto {
	@ApiProperty({ description: '참여자 정보' })
	user: UserInfoDTO;

	@ApiProperty({ description: '참여자 상태' })
	status: PaticipantStatus | null;

	@ApiProperty({ description: '참여자 역할' })
	role: Role | null;

	@ApiProperty({ description: '음소거 시간' })
	muteExpirationTime: Date | null;
}
