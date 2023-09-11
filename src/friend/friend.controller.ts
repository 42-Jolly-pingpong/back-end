import { Controller, Get, Param } from '@nestjs/common';
import { FriendService } from './friend.service';
import { ApiOperation } from '@nestjs/swagger';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';

@Controller('')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@ApiOperation({ summary: '유저 id를 이용한 친구 목록 찾기'})
	@Get('users/:id/friends')
	async getFriendList(@Param('id') userIdx: number): Promise<UserInfoDTO[]> {
		return await this.friendService.findAllFriendList(userIdx);
	}
}