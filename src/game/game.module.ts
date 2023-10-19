import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistory } from './entities/game-history.entity';
import { GameHistoryRepository } from './repositories/game-history.repository';
import { GameGateway } from './gateways/game.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([GameHistory])],
	controllers: [GameController],
	providers: [GameService, GameHistoryRepository, GameGateway],
})
export class GameModule {}
