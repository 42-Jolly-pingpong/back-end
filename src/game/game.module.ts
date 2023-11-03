import { Module } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { GameHistory } from 'src/game/entities/game-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from 'src/game/game.controller';
import { GameService } from 'src/game/game.service';
import { GameHistoryRepository } from 'src/game/repositories/game-history.repository';
import { GameGateway } from 'src/game/gateways/game.gateway';

@Module({
	imports: [TypeOrmModule.forFeature([GameHistory])],
	controllers: [GameController],
	providers: [GameService, GameHistoryRepository, GameGateway, UserRepository],
})
export class GameModule {}
