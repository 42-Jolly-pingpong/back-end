import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GameHistory } from 'src/game/entities/game-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { Game } from 'src/game/interfaces/game.interface';

@Injectable()
export class GameHistoryRepository extends Repository<GameHistory> {
	@InjectRepository(UserRepository) private userRepository: UserRepository;
	constructor(private dataSource: DataSource) {
		super(GameHistory, dataSource.createEntityManager());
	}

	async findGameHistoryByUserId(id: number): Promise<GameHistory[]> {
		const gameHistories = await this.find({
			relations: { winner: true, loser: true, scoreLog: true },
			where: [{ winnerId: id }, { loserId: id }],
			order: { playDate: 'DESC' },
		});
		return gameHistories;
	}

	async createHistory(gameInfo: Game) {
		const gameHistory = this.create({
			roomName: gameInfo.roomName,
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

	async gameHistorySave(gameInfo: Game) {
		const gameHistory = this.create({
			roomName: gameInfo.roomName,
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
		this.update(gameInfo.roomName, gameHistory);
	}
}
