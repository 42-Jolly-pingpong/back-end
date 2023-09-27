import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/user/dto/user.dto';

export class GetPrivateChatRoomDto {
	@ApiProperty({ description: 'dm 상대방' })
	@IsNotEmpty()
	chatMate: UserDto;
}
