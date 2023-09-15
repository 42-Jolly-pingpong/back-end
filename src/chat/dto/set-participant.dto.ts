import { IsNotEmpty, IsEnum, ValidateIf, IsEmpty } from 'class-validator';
import { Role } from 'src/chat/enums/role.enum';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';

export class SetParticipantDto {
	@IsNotEmpty()
	user: UserInfoDTO;

	@ApiProperty({ description: '참여자 상태' })
	@ValidateIf((user) => user.status != null)
	@IsEnum(PaticipantStatus)
	status: PaticipantStatus | null;

	@ApiProperty({ description: '참여자 역할' })
	@ValidateIf((user) => user.role != null)
	@IsEnum(Role)
	role: Role | null;

	@ApiProperty({ description: '음소거 시간' })
	@IsEmpty()
	muteExpirationTime: Date | null;
}
