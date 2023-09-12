import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ChatRoomType } from '../chat-room-type.enum';

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

	@Column({ name: 'update_time' })
	updateTime: Date;

	@Column({ name: 'status' })
	status: boolean;

	@Column({ name: 'current_people' })
	currentPeople: number;
}
