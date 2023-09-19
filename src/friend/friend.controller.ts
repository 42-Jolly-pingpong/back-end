import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { FriendRequestDTO } from './dto/friendRequest.DTO';

@Controller('friends')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@ApiOperation({ summary: '유저 id를 이용한 친구 목록 찾기' })
	@Get('/')
	async getFriendList(@Param('id') userIdx: number): Promise<UserInfoDTO[]> {
		return await this.friendService.findAllFriendList(userIdx);
	}

	@ApiOperation({ summary: '유저 id를 이용한 차단 친구 목록 찾기' })
	@Get('users/:id/black-list')
	async getBlackList(@Param('id') userIdx: number) {
		return await this.friendService.getBlackList(userIdx);
	}

	@ApiOperation({ summary: '친구 신청' })
	@ApiProperty({
		example: '3',
		description: 'sender_idx',
		required: true,
	})
	@ApiProperty({
		example: '4',
		description: 'receiver_idx',
		required: true,
	})
	@Post('/')
	async SendFriendRequest(@Body() requestInfo: FriendRequestDTO): Promise<void> {
		return await this.friendService.updateFriendRequest(requestInfo);
	}
}
