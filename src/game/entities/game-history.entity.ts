import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { GameMode } from 'src/game/enums/game-mode.enum';

@Entity('GameHistory')
export class GameHistory {
	@PrimaryColumn({ name: 'roomName', type: 'text' })
	roomName: string;

	@Column({name: 'winner_id', type: 'int'})
	winnerId: number;

	@Column({name: 'loser_id', type: 'int'})
	loserId: number;

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

	@Column({ name: 'play_time', type: 'int' })
	playTime: number;

	@Column({ name: 'mode', type: 'enum', enum: GameMode })
	mode: GameMode;
}
