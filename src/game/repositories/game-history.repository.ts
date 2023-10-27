import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GameHistory } from '../entities/game-history.entity';
import { Game } from '../interfaces/game.interface';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class GameHistoryRepository extends Repository<GameHistory> {
	@InjectRepository(UserRepository) private userRepository: UserRepository;
	constructor(private dataSource: DataSource) {
		super(GameHistory, dataSource.createEntityManager());
	}

	async findGameHistoryByUserId(id: number): Promise<GameHistory[]> {
		const gameHistories = await this.createQueryBuilder('GameHistory')
			.where(
				'GameHistory.winner_id = :id OR GameHistory.loser_id = :id',
				{ id }
			)
			.getMany();
		return gameHistories;
	}

	async gameHistorySave(gameInfo: Game) {
		const winner: UserDto = await this.userRepository.findUserById(
			gameInfo.winner === 1 ? gameInfo.player1.id : gameInfo.player2.id
		);
		const loser: UserDto = await this.userRepository.findUserById(
			gameInfo.winner !== 1 ? gameInfo.player1.id : gameInfo.player2.id
		);

		const gameHistory = this.create({
			winner,
			loser,
			winScore:
				gameInfo.winner === 1
					? gameInfo.player1.score
					: gameInfo.player2.score,
			loseScore:
				gameInfo.winner !== 1
					? gameInfo.player1.score
					: gameInfo.player2.score,
			playDate: new Date(),
			playTime: new Date(),
			mode: gameInfo.mode,
		});
		this.save(gameHistory);
	}
}
