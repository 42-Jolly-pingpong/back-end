import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FriendRequestDto } from 'src/friend/dto/friend-request.dto';
import { FriendRequest } from 'src/friend/entities/friend-request.entity';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class FriendRequestRepository extends Repository<FriendRequest> {
	constructor(private dataSource: DataSource) {
		super(FriendRequest, dataSource.createEntityManager());
	}

	async getFriendRequestList(receiverId: number): Promise<UserDto[]> {
		const requestList: FriendRequestDto[] = await this.find({
			where: { receiverId },
			relations: { receiver: true, sender: true },
		});

		if (requestList) {
			const sortedRequestList = requestList.sort((front, back) =>
				front.sender.nickname.localeCompare(back.sender.nickname)
			);

			return sortedRequestList.map((item) => item.sender);
		}
		return [];
	}

	async deleteFriendRequest(id: number, friendId: number): Promise<void> {
		const requestData = await this.findOne({
			where: [
				{ senderId: id, receiverId: friendId },
				{ senderId: friendId, receiverId: id },
			],
		});
		if (requestData) {
			await this.remove(requestData);
		}
	}

	async hasRequest(id: number, requestedId: number): Promise<boolean> {
		const requested = await this.findOne({
			where: { senderId: id, receiverId: requestedId },
		});

		return !!requested;
	}

	async updateFriendRequest(
		senderId: number,
		receiverId: number
	): Promise<void> {
		const exist = await this.findOne({
			where: { senderId, receiverId },
		});

		if (!exist) {
			await this.save({ senderId, receiverId });
		}
	}
}
