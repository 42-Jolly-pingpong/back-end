import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';
import { UserInfoDTO } from 'src/user/dto/userInfo.dto';
import { FriendDTO } from '../dto/friend.DTO';

@Injectable()
export class FriendRepository extends Repository<Friend> {
	constructor(private dataSource: DataSource) {
		super(Friend, dataSource.createEntityManager());
	}

	async findAllFriend(userIdx: number): Promise<UserInfoDTO[]> {
		const friend: FriendDTO[] = await this.find({
			relations: { user: true, friend: true },
			where: { userIdx: userIdx },
		});
		const friendList: UserInfoDTO[] = friend.map((item) => item.friend);
		return friendList;
	}
}
