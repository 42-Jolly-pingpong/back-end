import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { FriendDTO } from './dto/friend.DTO';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class FriendRepository extends Repository<Friend> {
	constructor(private dataSource: DataSource) {
		super(Friend, dataSource.createEntityManager());
	}

	async findAllFriend(userIdx: number): Promise<UserDto[]> {
		const friend: FriendDTO[] = await this.find({
			relations: { user: true, friend: true },
			where: { user_idx: userIdx },
		});
		const friendList: UserDto[] = friend.map((item) => item.friend);
		return friendList;
	}
}
