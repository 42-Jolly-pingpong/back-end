import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GameMode } from '../enums/game-mode.enum';

export class GameHistoryDto {
	@ApiProperty({ description: '히스토리 인덱스' })
	id: number;

	@ApiProperty({ description: '승리 플레이어' })
	winner: User;

	@ApiProperty({ description: '패배 플레이어' })
	loser: User;

	@ApiProperty({ description: '승리 스코어' })
	winScore: number;

	@ApiProperty({ description: '패배 스코어' })
	loseScore: number;

	@ApiProperty({ description: '플레이 날짜' })
	playDate: Date;

	@ApiProperty({ description: '총 플레이 시간' })
	playTime: Date;

	@ApiProperty({ description: '플레이 모드' })
	mode: GameMode;
}
