import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('Friend')
export class Friend {
	@PrimaryColumn({ name: 'user_id', type: 'int' })
	userId: number;

	@PrimaryColumn({ name: 'friend_id', type: 'int' })
	friendId: number;

	@ManyToOne((type) => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne((type) => User)
	@JoinColumn({ name: 'friend_id' })
	friend: User;
}
