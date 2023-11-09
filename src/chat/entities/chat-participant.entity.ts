import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { PaticipantStatus } from 'src/chat/enums/paticipant-status.enum';
import { Role } from 'src/chat/enums/role.enum';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ChatParticipant')
export class ChatParticipant {
	@PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
	id: number;

	@ManyToOne(() => ChatRoom, (room) => room.participants, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'roomId' })
	room: ChatRoom;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column({ name: 'role', type: 'varchar' })
	role: Role;

	@Column({ name: 'status', type: 'varchar' })
	status: PaticipantStatus;

	@Column({ name: 'mute_expiration_time', nullable: true, type: 'timestamp' })
	muteExpirationTime: Date | null;

	@OneToMany(() => Chat, (chat) => chat.user)
	chats: Chat[];

	@Column({ name: 'last_read_time', type: 'timestamp' })
	lastReadTime: Date;
}
