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
	@PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
	id: number;

	@Column({ name: 'room_name', type: 'varchar', length: 80 })
	@MaxLength(80)
	roomName: string;

	@Column({ name: 'room_type', type: 'varchar' })
	roomType: ChatRoomType;

	@Column({ name: 'password', nullable: true, type: 'text' })
	password: string | null;

	@CreateDateColumn({ name: 'created_at', type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'update_time', type: 'timestamp' })
	updatedTime: Date;

	@Column({ name: 'status', default: true, type: 'boolean' })
	status: boolean;

	@OneToMany(() => Chat, (chat) => chat.room)
	chats: Chat[];

	@OneToMany(() => ChatParticipant, (participant) => participant.room, {
		onDelete: 'NO ACTION',
	})
	participants: ChatParticipant[];
}
