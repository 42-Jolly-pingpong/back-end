import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistory } from './entities/game-history.entity';

@Module({
	imports: [TypeOrmModule.forFeature([GameHistory])],
	controllers: [GameController],
	providers: [GameService],
})
export class GameModule {}
