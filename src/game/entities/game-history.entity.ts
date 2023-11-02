import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameMode } from 'src/game/enums/game-mode.enum';

@Entity('GameHistory')
export class GameHistory {
	@PrimaryGeneratedColumn({ name: 'id', type: 'int' })
	id: number;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'winner_id' })
	winner: User;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'loser_id' })
	loser: User;

	@Column({ name: 'win_score', type: 'int2' })
	winScore: number;

	@Column({ name: 'lose_score', type: 'int2' })
	loseScore: number;

	@Column({ name: 'play_date', type: 'timestamp' })
	playDate: Date;

	@Column({ name: 'play_time', type: 'time' })
	playTime: Date;

	@Column({ name: 'mode', type: 'enum', enum: GameMode })
	mode: GameMode;
}
