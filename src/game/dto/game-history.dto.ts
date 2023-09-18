import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GameMode } from '../enums/game-mode.enum';

export class GameHistoryDto {
	@ApiProperty({ description: 'win player' })
	winUser: User;

	@ApiProperty({ description: 'lose player' })
	loseUser: User;

	@ApiProperty({ description: 'win score' })
	winScore: number;

	@ApiProperty({ description: 'lose score' })
	loseScore: number;

	@ApiProperty({ description: '플레이한 Date ' })
	playDate: Date;

	@ApiProperty({ description: '플레이 하는데 걸린 시간' })
	playTime: Date;

	@ApiProperty({ description: '게임 플레이 모드 ' })
	mode: GameMode;
}
