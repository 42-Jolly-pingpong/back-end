import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlockedFriend } from 'src/friend/entities/blocked-friend.entity';
import { BlockedFriendDto } from 'src/friend/dto/blocked-friend.dto';
import { UserDto } from 'src/user/dto/user.dto';

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
		const exist = await this.findOne({
			where: { userId: id, blockId },
		});

		if (!exist) {
			await this.save({ userId: id, blockId });
		}
	}

	async deleteBlockFriend(userId: number, blockId: number): Promise<void> {
		const blocked = await this.findOne({
			where: { userId, blockId },
		});

		if (blocked) {
			await this.remove(blocked);
		}
	}

	async findBlockList(id: number): Promise<UserDto[]> {
		const blackList: BlockedFriendDto[] = await this.find({
			relations: { user: true, block: true },
			where: { userId: id },
		});

		if (blackList) {
			const sortedBlackList = blackList.sort((front, back) =>
				front.block.nickname.localeCompare(back.block.nickname)
			);

			return sortedBlackList.map((item) => item.block);
		}
		return [];
	}
}
