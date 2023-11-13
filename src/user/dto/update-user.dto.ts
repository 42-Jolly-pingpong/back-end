import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
	@ApiProperty({ description: '닉네임' })
	nickname?: string;

	@ApiProperty({ description: '프로필 파일 경로' })
	avatarPath?: string;

	@ApiProperty({ description: '상태 메시지' })
	bio?: string;

	@ApiProperty({ description: '2차 인증 설정' })
	auth: boolean;

	@ApiProperty({ description: '2차 인증키' })
	secret?: string;
}
