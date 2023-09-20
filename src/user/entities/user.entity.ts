import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
	@PrimaryGeneratedColumn({ name: 'id', type: 'int' })
	id: number;

	@Column({ name: 'intra_id', type: 'text' })
	intraId: string;

	@Column({ name: 'e_mail', type: 'text' })
	email: string;

	@Column({ name: 'nickname', type: 'text' })
	nickname: string;

	@Column({ name: 'avatar_path', type: 'text', default: 'test' })
	avatarPath: string;

	@Column({ name: 'status', type: 'bool', default: false })
	status: boolean;

	@Column({ name: 'bio', type: 'text', nullable: true })
	bio: string;

	@Column({ name: 'auth', type: 'bool', default: false })
	auth: boolean;

	@Column({ name: 'win', type: 'int', default: 0 })
	winCount: number;

	@Column({ name: 'lose', type: 'int', default: 0 })
	loseCount: number;

	@Column({ name: 'is_leave', type: 'bool', default: false })
	isLeave: boolean;
}
