import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('Friend')
export class BlockedFriend {
	@PrimaryColumn()
	user_idx: number

	@PrimaryColumn()
	friend_idx: number

	@ManyToOne((type) => User)
	@JoinColumn({name: 'user_idx'})
	user: User

	@ManyToOne((type) => User)
	@JoinColumn({name: 'friend_idx'})
	friend: User
}
