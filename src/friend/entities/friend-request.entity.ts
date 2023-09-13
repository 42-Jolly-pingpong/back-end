import { User } from 'src/user/entities/user.entity';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('Friend_request')
export class Friend_request {
	@PrimaryColumn({name: 'sender_idx'})
	senderIdx: number

	@PrimaryColumn({name: 'receiver_idx'})
	receiverIdx: number

	@CreateDateColumn({ type: 'timestamptz' })
	update_time: Date
	
	@ManyToOne((type) => User)
	@JoinColumn({name: 'sender_idx'})
	sender: User

	@ManyToOne((type) => User)
	@JoinColumn({name: 'receiver_idx'})
	receiver: User
}
