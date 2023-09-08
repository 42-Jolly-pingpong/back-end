import { User } from 'src/user/entities/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Friend')
export class Friend extends BaseEntity {
	@PrimaryColumn()
	user_idx: number

	@PrimaryColumn()
	friend_idx: number

	@ManyToOne(() => User)
	@JoinColumn({name: 'user_idx'})
	user: User

	@ManyToOne(() => User)
	@JoinColumn({name: 'friend_idx'})
	friend: User
}
