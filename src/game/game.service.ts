import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistoryRepository } from 'src/game/repositories/game-history.repository';
import { GameHistoryDto } from 'src/game/dto/game-history.dto';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameHistoryRepository)
		private gameHistoryRepository: GameHistoryRepository
	) {}

	async getGameHistoryByUserId(id: number): Promise<GameHistoryDto[]> {
		return await this.gameHistoryRepository.findGameHistoryByUserId(id);
	}
}
