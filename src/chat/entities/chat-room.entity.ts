import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import { ChatRoomType } from '../enums/chat-room-type.enum';

@Entity('ChatRoom')
export class ChatRoom {
	@PrimaryGeneratedColumn({ name: 'room_idx' })
	roomIdx: number;

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
}
