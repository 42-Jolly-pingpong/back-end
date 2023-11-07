import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { User } from 'src/user/entities/user.entity';
import { UserController } from 'src/user/user.controller';
import { UserRepository } from 'src/user/user.repository';
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
