import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatParticipant } from './chat-participant.entity';

@Entity('Chat')
export class Chat {
	@PrimaryGeneratedColumn({ name: 'chat_idx' })
	chatIdx: number;

	@ManyToOne(() => ChatParticipant, (user) => user.chats)
	user: ChatParticipant;

	@Column({ name: 'content' })
	content: string;

	@CreateDateColumn({ name: 'time' })
	time: Date;
}
