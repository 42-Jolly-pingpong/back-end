import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserDto } from 'src/user/dto/user.dto';
import { FriendDto } from 'src/friend/dto/friend.dto';
import { BlockedFriend } from 'src/friend/entities/blocked-friend.entity';

@Injectable()
export class BlockedFriendRepository extends Repository<BlockedFriend> {
	constructor(private dataSource: DataSource) {
		super(BlockedFriend, dataSource.createEntityManager());
	}

	async findBlackList(userId: number): Promise<UserDto[]> {
		const blackList: FriendDto[] = await this.find({
			relations: { user: true, friend: true },
			where: { userId },
		});
		return blackList.map((item) => item.friend);
	}
}
