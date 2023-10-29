import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('BlockedFriend')
export class BlockedFriend {
	@PrimaryColumn({ name: 'user_id', type: 'int' })
	userId: number;

	@PrimaryColumn({ name: 'block_id', type: 'int' })
	blockId: number;

	@ManyToOne((type) => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne((type) => User)
	@JoinColumn({ name: 'block_id' })
	block: User;
}
