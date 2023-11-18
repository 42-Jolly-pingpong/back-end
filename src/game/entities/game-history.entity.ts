import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
} from 'typeorm';
import { GameMode } from 'src/game/enums/game-mode.enum';
import { ScoreLog } from 'src/game/entities/score-log.entity';

@Entity('GameHistory')
export class GameHistory {
	@PrimaryColumn({ name: 'roomName', type: 'text' })
	roomName: string;

	@Column({ name: 'winner_id', type: 'int' })
	winnerId: number;

	@Column({ name: 'loser_id', type: 'int' })
	loserId: number;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'winner_id' })
	winner: User;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'loser_id' })
	loser: User;

	@OneToMany(() => ScoreLog, scoreLog => scoreLog.gameHistory)
	scoreLog: ScoreLog[]

	@Column({ name: 'win_score', type: 'int2' })
	winScore: number;

	@Column({ name: 'lose_score', type: 'int2' })
	loseScore: number;

	@Column({ name: 'play_date', type: 'timestamp' })
	playDate: Date;

	@Column({ name: 'play_time', type: 'int' })
	playTime: number;

	@Column({ name: 'mode', type: 'enum', enum: GameMode })
	mode: GameMode;
}
