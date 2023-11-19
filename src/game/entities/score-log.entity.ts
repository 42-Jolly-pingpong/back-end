import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('ScoreLog')
export class ScoreLog {
	@PrimaryGeneratedColumn({ name: 'id', type: 'int'})
	id: number;

	@Column({name: 'room_name', type: 'text'})
	roomName: string;
	
	@Column({name: 'elapsed_time', type: 'int'})
	elapsedTime: number;

	@Column(({name: 'user_id', type: 'int'}))
	userId: number;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'user_id'})
	user: User;
}