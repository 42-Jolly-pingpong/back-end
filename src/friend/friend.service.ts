import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRepository } from './friend.repositody';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRepository)
		private friendRepository: FriendRepository
	) {}

	async findAllFriendList(userIdx: number): Promise<UserDto[]> {
		return await this.friendRepository.findAllFriend(userIdx);
	}
}
