import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { GameHistory } from "src/game/entities/game-history.entity";

@Entity('ScoreLog')
export class ScoreLog {

	@PrimaryGeneratedColumn({name: 'id', type: 'int'})
	id: number

	@Column({name: 'room_name', type: 'text'})
	roomName: string;
	
	@Column({name: 'elapsed_time', type: 'int'})
	elapsedTime: number;

	@Column(({name: 'user_id', type: 'int'}))
	userId: number;

	@ManyToOne(() => GameHistory)
	@JoinColumn({name: 'room_name'})
	gameHistory: GameHistory

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'user_id'})
	user: User;
}