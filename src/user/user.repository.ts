import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
	constructor(private dataSource: DataSource) {
		super(UserEntity, dataSource.createEntityManager());
	}

	async createUserInfo(userInfo: CreateUserDto): Promise<void> {
		console.log(userInfo);
		const user = this.create({
			intraId: userInfo.intra_id,
			e_mail: userInfo.e_mail,
			nickname: userInfo.nickname,
			avatarPath: userInfo.avatar_path,
			status: userInfo.status,
			auth: userInfo.auth,
			win: userInfo.win_count,
			lose: userInfo.lose_count,
			isLeave: userInfo.is_leave,
		});
		await this.save(user);
	}
}
