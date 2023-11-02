import { User } from 'src/user/entities/user.entity';
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';

@Entity('Friend_request')
export class FriendRequest {
	@PrimaryColumn({ name: 'sender_id', type: 'int' })
	senderId: number;

	@PrimaryColumn({ name: 'receiver_id', type: 'int' })
	receiverId: number;

	@CreateDateColumn({ name: 'update_time', type: 'timestamptz' })
	updateTime: Date;

	@ManyToOne((type) => User)
	@JoinColumn({ name: 'sender_id' })
	sender: User;

	@ManyToOne((type) => User)
	@JoinColumn({ name: 'receiver_id' })
	receiver: User;
}
