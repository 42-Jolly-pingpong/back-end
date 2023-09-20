import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({ description: '인트라 아이디' })
	intraId: string;

	@ApiProperty({ description: '이메일' })
	email: string;

	@ApiProperty({ description: '닉네임' })
	nickname: string;
}
