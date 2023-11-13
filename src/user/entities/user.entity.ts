import { UserStatus } from 'src/user/enums/user-status.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
	@PrimaryGeneratedColumn({ name: 'id', type: 'int' })
	id: number;

	@Column({ name: 'intra_id', type: 'text' })
	intraId: string;

	@Column({ name: 'email', type: 'text' })
	email: string;

	@Column({ name: 'nickname', type: 'text' })
	nickname: string;

	@Column({ name: 'avatar_path', type: 'text', nullable: true })
	avatarPath?: string;

	@Column({
		name: 'status',
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.OFFLINE,
	})
	status: UserStatus;

	@Column({ name: 'bio', type: 'text', nullable: true })
	bio?: string;

	@Column({ name: 'auth', type: 'bool', default: false })
	auth: boolean;

	@Column({ name: 'win_count', type: 'int', default: 0 })
	winCount: number;

	@Column({ name: 'lose_count', type: 'int', default: 0 })
	loseCount: number;

	@Column({ name: 'is_leave', type: 'bool', default: false })
	isLeave: boolean;

	@Column({ name: 'secret', type: 'text', nullable: true })
	secret?: string;
}
