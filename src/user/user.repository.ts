import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async createUserInfo(userInfo: CreateUserDto): Promise<void> {
		const user = this.create({ ...userInfo });
		await this.save(user);
	}

	async getUserByUserIdx(idx: number): Promise<UserDto> {
		return await this.findOneBy({ userIdx: idx });
	}
}
