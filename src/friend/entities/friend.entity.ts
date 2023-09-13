import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('Friend')
export class Friend {
	@PrimaryColumn({name: 'user_idx'})
	userIdx: number

	@PrimaryColumn({name: 'friend_idx'})
	friendIdx: number

	@ManyToOne((type) => User)
	@JoinColumn({name: 'user_idx'})
	user: User

	@ManyToOne((type) => User)
	@JoinColumn({name: 'friend_idx'})
	friend: User
}
