import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
	@PrimaryGeneratedColumn({ name: 'user_idx' })
	userIdx: number;

	@Column({ name: 'intra_id' })
	intraId: string;

	@Column({ name: 'e_mail' })
	email: string;

	@Column({ name: 'nickname' })
	nickname: string;

	@Column({ name: 'avatar_path', default: 'test' })
	avatarPath: string;

	@Column({ name: 'status', default: false })
	status: boolean;

	@Column({ name: 'status_message', nullable: true })
	statusMessage: string;

	@Column({ name: 'auth', default: false })
	auth: boolean;

	@Column({ name: 'win', default: 0 })
	winCount: number;

	@Column({ name: 'lose', default: 0 })
	loseCount: number;

	@Column({ name: 'is_leave', default: false })
	isLeave: boolean;
}
