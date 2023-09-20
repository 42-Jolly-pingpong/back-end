import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserDto } from 'src/user/dto/user.dto';
import { Friend } from '../entities/friend.entity';
import { FriendDTO } from '../dto/friend.DTO';

@Injectable()
export class FriendRepository extends Repository<Friend> {
	constructor(private dataSource: DataSource) {
		super(Friend, dataSource.createEntityManager());
	}

	async findAllFriend(userIdx: number): Promise<UserDto[]> {
		const friend: FriendDTO[] = await this.find({
			relations: { user: true, friend: true },
			where: { userId: userIdx },
		});
		const friendList: UserDto[] = friend.map((item) => item.friend);
		return friendList;
	}
}
