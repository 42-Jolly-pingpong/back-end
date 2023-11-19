import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserDto } from 'src/user/dto/user.dto';
import { Friend } from 'src/friend/entities/friend.entity';
import { FriendDto } from 'src/friend/dto/friend.dto';

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
			if (item.user.id == id) {
				return item.friend;
			} else {
				return item.user;
			}
		});

		if (friendList) {
			const sortedFriendList = friendList.sort((front, back) =>
				front.nickname.localeCompare(back.nickname)
			);
			return sortedFriendList;
		}
		return [];
	}

	async findFriendListByKeyword(
		id: number,
		keyword: string
	): Promise<UserDto[]> {
		const friendList: UserDto[] = await this.findFriendList(id);

		const filteredFriendList: UserDto[] = friendList.filter((user) => {
			return user.nickname.startsWith(keyword);
		});

		if (filteredFriendList) {
			const sortedFriendList = filteredFriendList.sort((front, back) =>
				front.nickname.localeCompare(back.nickname)
			);
			return sortedFriendList;
		}

		return [];
	}

	async deleteFriend(id: number, friendId: number): Promise<void> {
		const friendData = await this.findOne({
			where: [
				{ userId: id, friendId },
				{ userId: friendId, friendId: id },
			],
		});

		if (friendData) {
			await this.remove(friendData);
		}
	}

	async hasFriend(id: number, otherId: number): Promise<boolean> {
		const friend = await this.findOne({
			where: [
				{ userId: id, friendId: otherId },
				{ userId: otherId, friendId: id },
			],
		});
		return !!friend;
	}

	async updateFriend(id: number, otherId: number): Promise<void> {
		const exist = await this.findOne({
			where: [
				{ userId: id, friendId: otherId },
				{ userId: otherId, friendId: id },
			],
		});

		if (!exist) {
			await this.save({ userId: id, friendId: otherId });
		}
	}
}
