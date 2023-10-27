import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistory } from './entities/game-history.entity';
import { GameHistoryRepository } from './repositories/game-history.repository';
import { GameGateway } from './gateways/game.gateway';
import { UserRepository } from 'src/user/user.repository';

@Module({
	imports: [TypeOrmModule.forFeature([GameHistory])],
	controllers: [GameController],
	providers: [GameService, GameHistoryRepository, GameGateway, UserRepository],
})
export class GameModule {}
