import { ApiProperty } from '@nestjs/swagger';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { Role } from 'src/chat/enums/role.enum';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';

export class ChatParticipantDto {
	@ApiProperty({ description: '참여자 정보' })
	user: UserInfoDTO;

	@ApiProperty({ description: '참여자 상태' })
	status: PaticipantStatus;

	@ApiProperty({ description: '참여자 역할' })
	role: Role;

	@ApiProperty({ description: '음소거 시간' })
	muteExpirationTime: Date | null;
}
