import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { FriendRepository } from './friend.repositody';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRepository)
		private friendRepository: FriendRepository
	) {}

	async findAllFriendList(userIdx: number): Promise<UserInfoDTO[]> {
		return await this.friendRepository.findAllFriend(userIdx);
	}
}