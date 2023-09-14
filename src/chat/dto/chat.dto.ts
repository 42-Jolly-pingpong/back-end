import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';

export class ChatDto {
	@ApiProperty({ description: '챗 인덱스' })
	chatIdx: number;

	@ApiProperty({ description: '챗 보낸 사람' })
	user: UserInfoDTO;

	@ApiProperty({ description: '챗 내용' })
	content: string;

	@ApiProperty({ description: '보낸 시간' })
	time: Date;
}
