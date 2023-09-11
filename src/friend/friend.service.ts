import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { FriendRepository } from './friend.repository';
import { BlockedFriendRepository } from './blockedFriend.repository';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRepository)
		private friendRepository: FriendRepository,
		@InjectRepository(BlockedFriendRepository)
		private blockedFriendRepository: BlockedFriendRepository,
	) {}

	async findAllFriendList(userIdx: number): Promise<UserInfoDTO[]> {
		return await this.friendRepository.findAllFriend(userIdx);
	}

	async getBlackList(userIdx: number): Promise<UserInfoDTO[]> {
		return await this.blockedFriendRepository.findBlackList(userIdx);
	}
}
