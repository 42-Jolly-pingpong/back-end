import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/user/dto/user.dto';
import { FriendRepository } from 'src/friend/repositories/friend.repository';
import { BlockedFriendRepository } from 'src/friend/repositories/blocked-friend.repository';
import { FriendRequestRepository } from 'src/friend/repositories/friend-request.repository';
import { ProfileStatus } from 'src/friend/enums/profile-status.enum';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRepository)
		private friendRepository: FriendRepository,
		@InjectRepository(BlockedFriendRepository)
		private blockedFriendRepository: BlockedFriendRepository,
		@InjectRepository(FriendRequestRepository)
		private friendRequestRepository: FriendRequestRepository,
		@InjectRepository(UserRepository)
		private userRepository: UserRepository
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

	async getFriendState(id: number, otherId: number): Promise<ProfileStatus> {
		if (await this.friendRepository.hasFriend(id, otherId)) {
			return ProfileStatus.FRIEND;
		}

		if (await this.friendRequestRepository.hasRequest(id, otherId)) {
			return ProfileStatus.REQUESTEDBYME;
		}

		if (await this.friendRequestRepository.hasRequest(otherId, id)) {
			return ProfileStatus.REQUESTEDBYOTHER;
		}

		if (await this.blockedFriendRepository.hasBlockedByMe(id, otherId)) {
			return ProfileStatus.BLOCKEDBYME;
		}

		if (await this.blockedFriendRepository.hasBlockedByOther(id, otherId)) {
			return ProfileStatus.BLOCKEDBYOTHER;
		}

		if (await this.userRepository.hasLeave(id)) {
			return ProfileStatus.UNKNOWN;
		}
		return ProfileStatus.UNDEFINED;
	}

	async getFriendRequestList(receiverId: number): Promise<UserDto[]> {
		return await this.friendRequestRepository.getFriendRequestList(
			receiverId
		);
	}

	async acceptFriendRequest(id: number, otherId: number): Promise<void> {
		await this.friendRequestRepository.deleteFriendRequest(id, otherId);
		await this.friendRequestRepository.deleteFriendRequest(otherId, id);
		await this.friendRepository.updateFriend(id, otherId);
	}

	async denyFriendRequest(id: number, otherId: number): Promise<void> {
		await this.friendRequestRepository.deleteFriendRequest(id, otherId);
	}

	async updateFriendRequest(
		senderId: number,
		receiverId: number
	): Promise<void> {
		await this.friendRequestRepository.updateFriendRequest(
			senderId,
			receiverId
		);
	}
	async getBlockList(id: number): Promise<UserDto[]> {
		return await this.blockedFriendRepository.findBlockList(id);
	}

	async deleteBlockFriend(userId: number, blockId: number): Promise<void> {
		await this.blockedFriendRepository.deleteBlockFriend(userId, blockId);
	}
}
