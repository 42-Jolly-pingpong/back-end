import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import { ChatRoomType } from '../chat-room-type.enum';

@Entity('ChatRoom')
export class ChatRoom {
	@PrimaryGeneratedColumn({ name: 'roomIdx' })
	roomIdx: number;

	@Column({ name: 'roomName' })
	roomName: string;

	@Column({ name: 'roomType' })
	roomType: ChatRoomType;

	@Column({ name: 'password', nullable: true })
	password: number | null;

	@Column({ name: 'maxPeople' })
	maxPeople: number;

	@UpdateDateColumn({ name: 'updateTime' })
	updatedTime: Date;

	@Column({ name: 'status', default: true })
	status: boolean;

	@Column({ name: 'currentPeople', default: 1 })
	currentPeople: number;
}
