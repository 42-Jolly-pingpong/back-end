import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { GameService } from 'src/game/game.service';
import { GameHistoryRepository } from 'src/game/repositories/game-history.repository';
import { ScoreLogRepository } from 'src/game/repositories/score-log.repository';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserController],
	providers: [
		UserService,
		GameService,
		GameHistoryRepository,
		ScoreLogRepository,
		UserRepository,
	],
})
export class UserModule {}
