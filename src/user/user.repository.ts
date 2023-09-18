import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDTO } from './dto/userInfo.dto';

@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async createUserInfo(userInfo: CreateUserDto): Promise<void> {
		const user = userInfo;

		await this.save(user);
	}

	async getUserInfobyIdx(idx: number): Promise<UserInfoDTO> {
		return await this.findOneBy({ userIdx: idx });
	}

	async deleteUserInfobyIdx(idx: number): Promise<void> {
		await this.delete({ userIdx: idx });
	}
}
