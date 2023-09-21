import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('ChatRoom')
export class ChatRoom {
	@PrimaryGeneratedColumn({ name: 'id' })
	id: number;

	@Column({ name: 'room_name' })
	roomName: string;

	@Column({ name: 'room_type' })
	roomType: ChatRoomType;

	@Column({ name: 'password', nullable: true })
	password: number | null;

	@Column({ name: 'max_people' })
	maxPeople: number;

	@UpdateDateColumn({ name: 'update_time' })
	updatedTime: Date;

	@Column({ name: 'status', default: true })
	status: boolean;

	@Column({ name: 'current_people', default: 1 })
	currentPeople: number;

	@OneToMany(() => Chat, (chat) => chat.room)
	chats: Chat[];

	@OneToMany(() => ChatParticipant, (participant) => participant.room, {
		onDelete: 'NO ACTION',
	})
	participants: ChatParticipant[];
}
