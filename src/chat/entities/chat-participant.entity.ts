import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomAuth } from '../enums/room-auth.enum';
import { PaticipantStatus } from '../enums/paticipant-status.enum';
import { User } from 'src/user/entities/user.entity';
import { ChatRoom } from './chat-room.entity';
import { Chat } from './chat.entity';

@Entity('ChatParticipant')
export class ChatParticipant {
	@PrimaryGeneratedColumn({ name: 'participant_idx' })
	participantIdx: number;

	@ManyToOne(() => ChatRoom, (room) => room.participants, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'roomIdx' })
	room: ChatRoom;

	@ManyToOne(() => User, (user) => user.userIdx)
	@JoinColumn({ name: 'userIdx' })
	user: User;

	@Column({ name: 'room_auth' })
	roomAuth: RoomAuth;

	@Column({ name: 'status' })
	status: PaticipantStatus;

	@Column({ name: 'mute_expiration_time', nullable: true })
	muteExpirationTime: Date | null;

	@OneToMany(() => Chat, (chat) => chat.user)
	chats: Chat[];
}
