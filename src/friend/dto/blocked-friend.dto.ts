import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

export class BlockedFriendDto {
	@ApiProperty({ description: '차단한 유저' })
	user: UserDto;

	@ApiProperty({ description: '차단된 유저' })
	block: UserDto;
}
