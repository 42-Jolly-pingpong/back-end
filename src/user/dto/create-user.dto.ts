import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
	@ApiProperty({ description: '인트라 아이디' })
	intra_id: string;
	
	@ApiProperty({ description: '이메일' })
	e_mail: string;

	@ApiProperty({ description: '닉네임' })
	nickname: string;

	@ApiProperty({ description: '프로필 사진 경로' })
	avatar_path: string;

	@ApiProperty({ description: '접속 상태' })
	status: boolean;

	@ApiProperty({ description: '2차 인증 여부' })
	auth: boolean;

	@ApiProperty({ description: '승리 횟수' })
	win_count: number;

	@ApiProperty({ description: '패배 횟수' })
	lose_count: number;

	@ApiProperty({ description: '계정 탈퇴 상태' })
	is_leave: boolean;
}
