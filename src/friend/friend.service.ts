import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRepository } from './repositories/friend.repository';
import { BlockedFriendRepository } from './repositories/blocked-friend.repository';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequestRepository } from './repositories/friend-request.repository';
import { UserDto } from 'src/user/dto/user.dto';

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

	async getFriendList(id: number): Promise<UserDto[]> {
		return await this.friendRepository.findFriendList(id);
	}

	async getFriendListByKeyword(
		id: number,
		keyword: string
	): Promise<UserDto[]> {
		return await this.friendRepository.findFriendListByKeyword(id, keyword);
	}

	async getBlackList(userIdx: number): Promise<UserDto[]> {
		return await this.blockedFriendRepository.findBlackList(userIdx);
	}

	async updateFriendRequest(requestInfo: FriendRequestDto): Promise<void> {
		return await this.friendRequestRepository.updateFriendRequest(
			requestInfo
		);
	}
}

//async findAllFriendList(userIdx: number): Promise<UserDto[]> {
//	return await this.friendRepository.findAllFriend(userIdx);
//}
