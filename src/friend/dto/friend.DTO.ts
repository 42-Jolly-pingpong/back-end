import { ApiProperty } from "@nestjs/swagger";
import { UserInfoDTO } from "src/user/dto/userInfo.dto";

export class FriendDTO {
	@ApiProperty({ description: '유저' })
	user: UserInfoDTO;
	@ApiProperty({ description: '친구' })
	friend: UserInfoDTO;
}