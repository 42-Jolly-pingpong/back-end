import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FriendRequest } from '../entities/friendRequest.entity';
import { FriendRequestDTO } from '../dto/friendRequest.DTO';

@Injectable()
export class FriendRequestRepository extends Repository<FriendRequest> {
	constructor(private dataSource: DataSource) {
		super(FriendRequest, dataSource.createEntityManager());
	}

	async updateFriendRequest(requestInfo: FriendRequestDTO): Promise<void> {
		console.log(requestInfo);
		await this.save(requestInfo);
	}
}
