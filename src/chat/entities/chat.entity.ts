import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ChatParticipant } from './chat-participant.entity';

// CREATE TABLE `chat` (
// 	`chat_idx`	number	NOT NULL,
// 	`chat_user_idx`	number	NOT NULL,
// 	`content`	text	NULL,
// 	`time`	time	NULL
// );

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
