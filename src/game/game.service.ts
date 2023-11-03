import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistoryRepository } from 'src/game/repositories/game-history.repository';
import { GameHistoryDto } from 'src/game/dto/game-history.dto';
import { ScoreLogDto } from 'src/game/dto/score-log.dto';
import { ScoreLogRepository } from './repositories/score-log.repository';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameHistoryRepository)
		private gameHistoryRepository: GameHistoryRepository,
		@InjectRepository(ScoreLogRepository)
		private scoreLogRepository: ScoreLogRepository
	) {}

	async getGameHistoryByUserId(id: number): Promise<GameHistoryDto[]> {
		return await this.gameHistoryRepository.findGameHistoryByUserId(id);
	}

	async getGameScoreLogByRoomName(roomName: string): Promise<ScoreLogDto[]> {
		return await this.scoreLogRepository.getScoreLog(roomName);
	}
}
