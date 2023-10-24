import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlockedFriend } from 'src/friend/entities/blocked-friend.entity';

@Injectable()
export class BlockedFriendRepository extends Repository<BlockedFriend> {
	constructor(private dataSource: DataSource) {
		super(BlockedFriend, dataSource.createEntityManager());
	}

	async hasBlockedByMe(id: number, blockId: number): Promise<boolean> {
		const blocked = await this.findOne({
			where: { userId: id, blockId },
		});
		return !!blocked;
	}

	async hasBlockedByOther(id: number, blockId: number): Promise<boolean> {
		const blocked = await this.findOne({
			where: { userId: blockId, blockId: id },
		});
		return !!blocked;
	}

	async updateBlockedFriend(id: number, blockId: number): Promise<void> {
		const blocked = this.create({
			userId: id,
			blockId: blockId,
		});
		await this.save(blocked);
	}

	//async findBlackList(userId: number): Promise<UserDto[]> {
	//	const blackList: FriendDto[] = await this.find({
	//		relations: { user: true, block: true },
	//		where: { userId },
	//	});
	//	return blackList.map((item) => item.friend);
	//}
}
