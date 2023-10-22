import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { FriendService } from 'src/friend/friend.service';
import { FriendRequestDto } from 'src/friend/dto/friend-request.dto';

@Controller('friends')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@ApiOperation({ summary: '유저 id를 이용한 친구 목록 불러오기' })
	@Get('/:id')
	async getFriendList(@Param('id') id: number): Promise<UserDto[]> {
		return await this.friendService.getFriendList(+id);
	}

	@ApiOperation({ summary: '키워드를 통한 친구 목록 불러오기' })
	@Get('/:id/search/:keyword')
	async getFriendListByKeyword(
		@Param('id') id: number,
		@Param('keyword') keyword: string
	): Promise<UserDto[]> {
		const friends = await this.friendService.getFriendListByKeyword(
			+id,
			keyword
		);
		return friends;
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
	async SendFriendRequest(
		@Body() requestInfo: FriendRequestDto
	): Promise<void> {
		return await this.friendService.updateFriendRequest(requestInfo);
	}
}

// [삭제 예정] : API 명세와 다름
//@ApiOperation({ summary: '유저 id를 이용한 친구 목록 찾기' })
//@Get('/')
//async getFriendList(@Param('id') userIdx: number): Promise<UserDto[]> {
//	return await this.friendService.findAllFriendList(userIdx);
//}
