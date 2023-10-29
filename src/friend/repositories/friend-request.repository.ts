import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FriendRequestDto } from 'src/friend/dto/friend-request.dto';
import { FriendRequest } from 'src/friend/entities/friend-request.entity';

@Injectable()
export class FriendRequestRepository extends Repository<FriendRequest> {
	constructor(private dataSource: DataSource) {
		super(FriendRequest, dataSource.createEntityManager());
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

	async updateFriendRequest(requestInfo: FriendRequestDto): Promise<void> {
		console.log(requestInfo);
		await this.save(requestInfo);
	}
}
