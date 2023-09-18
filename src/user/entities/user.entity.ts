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

	@Column({ name: 'avatar_path' })
	avatarPath: string;

	@Column({ name: 'status' })
	status: boolean;

	@Column({ name: 'auth' })
	auth: boolean;

	@Column({ name: 'win' })
	win: number;

	@Column({ name: 'lose' })
	lose: number;

	@Column({ name: 'is_leave' })
	isLeave: boolean;
}
