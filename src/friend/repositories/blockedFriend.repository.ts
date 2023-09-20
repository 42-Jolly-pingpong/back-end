import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlockedFriend } from '../entities/blockedFriend.entity';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { FriendDTO } from '../dto/friend.DTO';

@Injectable()
export class BlockedFriendRepository extends Repository<BlockedFriend> {
	constructor(private dataSource: DataSource) {
		super(BlockedFriend, dataSource.createEntityManager());
	}

	async findBlackList(userId: number): Promise<UserInfoDTO[]> {
		const blackList: FriendDTO[] = await this.find({
			relations: { user: true, friend: true },
			where: { userId },
		});
		return blackList.map((item) => item.friend);
	}
}
