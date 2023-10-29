import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/user/dto/user.dto';
import { FriendRequestDto } from 'src/friend/dto/friend-request.dto';
import { FriendRepository } from 'src/friend/repositories/friend.repository';
import { BlockedFriendRepository } from 'src/friend/repositories/blocked-friend.repository';
import { FriendRequestRepository } from 'src/friend/repositories/friend-request.repository';

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

	async deleteFriend(id: number, friendId: number): Promise<void> {
		return await this.friendRepository.deleteFriend(id, friendId);
	}

	async updateBlockFriend(id: number, blockId: number): Promise<void> {
		await this.friendRepository.deleteFriend(id, blockId);
		await this.friendRequestRepository.deleteFriendRequest(id, blockId);
		await this.blockedFriendRepository.updateBlockedFriend(id, blockId);
	}
	////
	//async getBlackList(userIdx: number): Promise<UserDto[]> {
	//	return await this.blockedFriendRepository.findBlackList(userIdx);
	//}

	async updateFriendRequest(requestInfo: FriendRequestDto): Promise<void> {
		return await this.friendRequestRepository.updateFriendRequest(
			requestInfo
		);
	}
}
