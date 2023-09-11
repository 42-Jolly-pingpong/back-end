import { Controller, Get, Param } from '@nestjs/common';
import { FriendService } from './friend.service';

@Controller('')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Get('users/:id/friends')
	getFriendList(@Param('id') userIdx: number) {
		return this.friendService.findAllFriendList(userIdx);
	}
}
