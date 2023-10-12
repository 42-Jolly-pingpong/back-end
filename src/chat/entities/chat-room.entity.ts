import { MaxLength } from 'class-validator';
import { ChatParticipant } from 'src/chat/entities/chat-participant.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatRoomType } from 'src/chat/enums/chat-room-type.enum';
import {
	Column,
	CreateDateColumn,
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
	@MaxLength(80)
	roomName: string;

	@Column({ name: 'room_type' })
	roomType: ChatRoomType;

	@Column({ name: 'password', nullable: true })
	password: string | null;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'update_time' })
	updatedTime: Date;

	@Column({ name: 'status', default: true })
	status: boolean;

	@OneToMany(() => Chat, (chat) => chat.room)
	chats: Chat[];

	@OneToMany(() => ChatParticipant, (participant) => participant.room, {
		onDelete: 'NO ACTION',
	})
	participants: ChatParticipant[];
}
