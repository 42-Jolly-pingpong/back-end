import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { GameMode } from '../enums/game-mode.enum';

@Entity('GameHistory')
export class GameHistory {
	@PrimaryGeneratedColumn({ type: 'int', name: 'history_idx' })
	historyIdx!: number;

	@ManyToOne(() => User, (user) => user.userIdx)
	@JoinColumn({ name: 'user_idx' })
	winUser!: User;

	@ManyToOne(() => User, (user) => user.userIdx)
	@JoinColumn({ name: 'user_idx' })
	loseUser!: User;

	@Column({ type: 'int2', name: 'win_score' })
	winScore!: number;

	@Column({ type: 'int2', name: 'lose_score' })
	loseScore!: number;

	@Column({ type: 'timestamp', name: 'play_date ' })
	playDate!: Date;

	@Column({ type: 'time', name: 'play_time' })
	playTime!: Date;

	@Column({ type: 'enum', name: 'mode', enum: GameMode })
	mode!: GameMode;
}
