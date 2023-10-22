import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserDto } from 'src/user/dto/user.dto';
import { Friend } from '../entities/friend.entity';
import { FriendDto } from '../dto/friend.dto';

@Injectable()
export class FriendRepository extends Repository<Friend> {
	constructor(private dataSource: DataSource) {
		super(Friend, dataSource.createEntityManager());
	}

	async findFriendList(id: number): Promise<UserDto[]> {
		const friends: FriendDto[] = await this.find({
			relations: { user: true, friend: true },
			where: [{ userId: id }, { friendId: id }],
		});

		const friendList: UserDto[] = friends.map((item) => {
			if (item.user.id === id) {
				return item.friend;
			} else {
				return item.user;
			}
		});
		return friendList;
	}

	async findFriendListByKeyword(
		id: number,
		keyword: string
	): Promise<UserDto[]> {
		const friendList: UserDto[] = await this.findFriendList(id);

		const filteredFriendList: UserDto[] = friendList.filter((user) => {
			return user.nickname.startsWith(keyword);
		});

		return filteredFriendList;
	}
}
