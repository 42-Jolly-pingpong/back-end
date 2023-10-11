import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Chat')
export class Chat {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@ManyToOne(() => ChatParticipant, (user) => user.chats)
	@JoinColumn({ name: 'userId' })
	user: ChatParticipant;

	@ManyToOne(() => ChatRoom, (room) => room.chats)
	@JoinColumn({ name: 'roomId' })
	room: ChatRoom;

	@Column({ name: 'content' })
	content: string;

	@CreateDateColumn({ name: 'time' })
	time: Date;
}
