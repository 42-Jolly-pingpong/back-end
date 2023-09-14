import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatParticipant } from './chat-participant.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('Chat')
export class Chat {
	@PrimaryGeneratedColumn({ name: 'chat_idx' })
	chatIdx: number;

	@ManyToOne(() => ChatParticipant, (user) => user.chats)
	@JoinColumn({ name: 'userIdx' })
	user: ChatParticipant;

	@ManyToOne(() => ChatRoom, (room) => room.chats)
	@JoinColumn({ name: 'roomIdx' })
	room: ChatRoom;

	@Column({ name: 'content' })
	content: string;

	@CreateDateColumn({ name: 'time' })
	time: Date;
}
