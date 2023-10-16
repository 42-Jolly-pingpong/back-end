import { IsNotEmpty, IsEnum, NotEquals } from 'class-validator';
import { Role } from 'src/chat/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

export class SetParticipantRoleDto {
	@ApiProperty({ description: '챗룸 아이디' })
	@IsNotEmpty()
	roomId: number;

	@ApiProperty({ description: '참여자 정보' })
	@IsNotEmpty()
	user: UserDto;

	@ApiProperty({ description: '참여자 역할' })
	@IsEnum(Role)
	@NotEquals(Role.OWNER)
	role: Role;
}
