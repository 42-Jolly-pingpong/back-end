import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GameHistory } from '../entities/game-history.entity';

@Injectable()
export class GameHistoryRepository extends Repository<GameHistory> {
	constructor(private dataSource: DataSource) {
		super(GameHistory, dataSource.createEntityManager());
	}

	async findGameHistoryByUserId(id: number): Promise<GameHistory[]> {
		const gameHistories = await this.createQueryBuilder('GameHistory')
			.where('GameHistory.winner_id = :id OR GameHistory.loser_id = :id', { id })
			.getMany();
		return gameHistories;
	}
}
