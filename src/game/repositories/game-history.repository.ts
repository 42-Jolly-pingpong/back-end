import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GameHistory } from 'src/game/entities/game-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { UserDto } from 'src/user/dto/user.dto';
import { Game } from 'src/game/interfaces/game.interface';

@Injectable()
export class GameHistoryRepository extends Repository<GameHistory> {
	@InjectRepository(UserRepository) private userRepository: UserRepository;
	constructor(private dataSource: DataSource) {
		super(GameHistory, dataSource.createEntityManager());
	}

	async findGameHistoryByUserId(id: number): Promise<GameHistory[]> {
		const gameHistories = await this.find({
			relations: { winner: true, loser: true },
			where: [{ winnerId: id }, { loserId: id }],
		});
		return gameHistories;
	}

	async gameHistorySave(gameInfo: Game) {
		const gameHistory = this.create({
			winnerId:
				gameInfo.winner === 1
					? gameInfo.player1.id
					: gameInfo.player2.id,
			loserId:
				gameInfo.winner !== 1
					? gameInfo.player1.id
					: gameInfo.player2.id,
			winScore:
				gameInfo.winner === 1
					? gameInfo.player1.score
					: gameInfo.player2.score,
			loseScore:
				gameInfo.winner !== 1
					? gameInfo.player1.score
					: gameInfo.player2.score,
			playDate: gameInfo.startTime,
			playTime: Date.now() - Date.parse(gameInfo.startTime.toString()),
			mode: gameInfo.mode,
		});
		this.save(gameHistory);
	}
}
