import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { FriendRepository } from './repositories/friend.repository';
import { BlockedFriendRepository } from './repositories/blockedFriend.repository';
import { FriendRequestDTO } from './dto/friendRequest.DTO';
import { FriendRequestRepository } from './repositories/friendRequest.repository';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRepository)
		private friendRepository: FriendRepository,
		@InjectRepository(BlockedFriendRepository)
		private blockedFriendRepository: BlockedFriendRepository,
		@InjectRepository(FriendRequestRepository)
		private friendRequestRepository: FriendRequestRepository
	) {}

	async findAllFriendList(userIdx: number): Promise<UserInfoDTO[]> {
		return await this.friendRepository.findAllFriend(userIdx);
	}

	async getBlackList(userIdx: number): Promise<UserInfoDTO[]> {
		return await this.blockedFriendRepository.findBlackList(userIdx);
	}

	async updateFriendRequest(requestInfo: FriendRequestDTO): Promise<void> {
		return await this.friendRequestRepository.updateFriendRequest(requestInfo);
	}
}
