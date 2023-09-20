import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlockedFriend } from '../entities/blockedFriend.entity';
import { FriendDTO } from '../dto/friend.DTO';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class BlockedFriendRepository extends Repository<BlockedFriend> {
	constructor(private dataSource: DataSource) {
		super(BlockedFriend, dataSource.createEntityManager());
	}

	async findBlackList(userId: number): Promise<UserDto[]> {
		const blackList: FriendDTO[] = await this.find({
			relations: { user: true, friend: true },
			where: { userId },
		});
		return blackList.map((item) => item.friend);
	}
}
