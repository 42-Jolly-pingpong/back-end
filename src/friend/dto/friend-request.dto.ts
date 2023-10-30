import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

export class FriendRequestDto {
	@ApiProperty({ description: '요청 보내는 유저' })
	sender: UserDto;

	@ApiProperty({ description: '요청 받는 유저' })
	receiver: UserDto;
}
