import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
	@PrimaryGeneratedColumn()
	user_idx: number;

	@Column()
	intra_id: string;

	@Column()
	nickname: string;

	@Column()
	avatar_path: string;

	@Column()
	status: boolean;

	@Column()
	auth: boolean;

	@Column()
	win: number;

	@Column()
	lose: number;

	@Column()
	is_leave: boolean;
}
