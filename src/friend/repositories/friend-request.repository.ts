import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { FriendRequestDto } from '../dto/friend-request.dto';

@Injectable()
export class FriendRequestRepository extends Repository<FriendRequest> {
	constructor(private dataSource: DataSource) {
		super(FriendRequest, dataSource.createEntityManager());
	}

	async updateFriendRequest(requestInfo: FriendRequestDto): Promise<void> {
		console.log(requestInfo);
		await this.save(requestInfo);
	}
}
