import { UserInfo } from "os";
import { UserInfoDTO } from "src/user/dto/userInfo.dto";

export class FriendDTO {
	user: UserInfoDTO;
	friend: UserInfoDTO;
}