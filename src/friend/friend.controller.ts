import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { FriendService } from 'src/friend/friend.service';
import { FriendRequestDto } from 'src/friend/dto/friend-request.dto';
import { AuthJwtGuard } from 'src/auth/guards/jwt-guard';
import { GetUser } from 'src/auth/decorators/user-info';
import { User } from 'src/user/entities/user.entity';

@Controller('friends')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	/**
	 * friend.repository 메서드
	 */

	@ApiOperation({ summary: '유저 id를 이용한 친구 목록 불러오기' })
	@Get('/:id')
	async getFriendList(@Param('id') id: number): Promise<UserDto[]> {
		return await this.friendService.getFriendList(+id);
	}

	@ApiOperation({ summary: '친구 삭제' })
	@UseGuards(AuthJwtGuard)
	@Delete('/:id')
	async deleteFriend(
		@GetUser() user: User,
		@Param('id') friendId: number
	): Promise<void> {
		await this.friendService.deleteFriend(user.id, friendId);
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

	/**
	 *	blocked-friend.repository 메서드
	 */

	@ApiOperation({ summary: '블랙리스트에 추가하기' })
	@UseGuards(AuthJwtGuard)
	@Post('/blocked/:id')
	async updateBlockFriend(
		@GetUser() user: User,
		@Param('id') blockId: number
	): Promise<void> {
		await this.friendService.updateBlockFriend(user.id, blockId);
	}

	/**
	 * friend-request.repository 메서드
	 */
	//@ApiOperation({summary: ''})
}

/**
 * 블랙홀 보낼 애들
 */
/**
 *
 *
 *
 */
//@ApiOperation({ summary: '유저 id를 이용한 차단 친구 목록 찾기' })
//@Get('users/:id/black-list')
//async getBlackList(@Param('id') userIdx: number) {
//	return await this.friendService.getBlackList(userIdx);

//	@ApiOperation({ summary: '친구 신청' })
//	@ApiProperty({
//		example: '3',
//		description: 'sender_idx',
//		required: true,
//	})
//	@ApiProperty({
//		example: '4',
//		description: 'receiver_idx',
//		required: true,
//	})
//	@Post('/')
//	async SendFriendRequest(
//		@Body() requestInfo: FriendRequestDto
//	): Promise<void> {
//		return await this.friendService.updateFriendRequest(requestInfo);
//	}
//}

// [삭제 예정] : API 명세와 다름
//@ApiOperation({ summary: '유저 id를 이용한 친구 목록 찾기' })
//@Get('/')
//async getFriendList(@Param('id') userIdx: number): Promise<UserDto[]> {
//	return await this.friendService.findAllFriendList(userIdx);
//}
