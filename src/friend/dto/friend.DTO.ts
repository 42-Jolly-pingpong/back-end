import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

export class FriendDTO {
	@ApiProperty({ description: '유저' })
	user: UserDto;
	
	@ApiProperty({ description: '유저' })
	friend: UserDto;
}
