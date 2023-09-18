import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistoryRepository } from './repositories/game-history.repository';
import { GameHistoryDto } from './dto/game-history.dto';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameHistoryRepository)
		private gameHistoryRepository: GameHistoryRepository
	) {}

	async getGameHistoryByuserIdx(idx: number): Promise<GameHistoryDto[]> {
		return await this.gameHistoryRepository.findGameHistoryByuserIdx(idx);
	}

	//create(createGameDto: CreateGameDto) {
	//	return 'This action adds a new game';
	//}
}
