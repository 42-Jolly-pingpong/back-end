import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GameHistory } from '../entities/game-history.entity';

@Injectable()
export class GameHistoryRepository extends Repository<GameHistory> {
	constructor(private dataSource: DataSource) {
		super(GameHistory, dataSource.createEntityManager());
	}

	async findGameHistoryByuserIdx(idx: number): Promise<GameHistory[]> {
		const gameHistories = await this.createQueryBuilder('GameHistory')
			.where('GameHistory.win_player_idx = :userIdx', { userIdx: idx })
			.orWhere('GameHistory.lose_player_idx = :userIdx', { userIdx: idx })
			.getMany();

		return gameHistories;
	}
}
