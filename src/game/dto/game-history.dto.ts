import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GameMode } from 'src/game/enums/game-mode.enum';
import { ScoreLogDto } from './score-log.dto';

export class GameHistoryDto {
	@ApiProperty({ description: '방 이름' })
	roomName: string;

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
	playTime: number;

	@ApiProperty({ description: '플레이 모드' })
	mode: GameMode;

	@ApiProperty({ description: '스코어 이력' })
	scoreLogs?: ScoreLogDto[];
}
