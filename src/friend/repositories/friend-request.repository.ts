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

	async getFriendRequestList(id: number): Promise<UserDto[]> {
		const requestList: FriendRequestDto[] = await this.find({
			where: { receiverId: id },
			relations: { receiver: true },
		});

		if (requestList) {
			return requestList.map((item) => item.receiver);
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
			await this.delete(requestData);
		}
	}

	async hasRequest(id: number, requestedId: number): Promise<boolean> {
		const requested = await this.findOne({
			where: { senderId: id, receiverId: requestedId },
		});

		return !!requested;
	}

	async updateFriendRequest(requestInfo: FriendRequestDto): Promise<void> {
		console.log(requestInfo);
		await this.save(requestInfo);
	}
}
