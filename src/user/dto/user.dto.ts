import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiProperty({ description: '유저 아이디' })
	id: number;

	@ApiProperty({ description: '인트라 아이디' })
	intraId: string;

	@ApiProperty({ description: '이메일' })
	email: string;

	@ApiProperty({ description: '닉네임' })
	nickname: string;

	@ApiProperty({ description: '프로필 파일 경로' })
	avatarPath: string;

	@ApiProperty({ description: '접속 유무' })
	status: boolean;

	@ApiProperty({ description: '상태 메시지' })
	bio: string;

	@ApiProperty({ description: '2차 인증 설정' })
	auth: boolean;

	@ApiProperty({ description: '게임에서 이긴 횟수' })
	winCount: number;

	@ApiProperty({ description: '게임에서 진 횟수' })
	loseCount: number;

	@ApiProperty({ description: '탈퇴 유무' })
	isLeave: boolean;
}
