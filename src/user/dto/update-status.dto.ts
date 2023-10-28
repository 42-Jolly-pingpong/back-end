import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../enums/user-status.enum';

export class UpdateStatusDto {
	@ApiProperty({ description: '유저 상태' })
	status: UserStatus;
}
