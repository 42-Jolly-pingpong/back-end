import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Like, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async createUser(userDto: CreateUserDto): Promise<void> {
		const user = this.create({ ...userDto });
		await this.save(user);
	}

	async updateUser(
		userDto: UserDto,
		updateUserDto: UpdateUserDto
	): Promise<void> {
		const user = { ...userDto, ...updateUserDto };
		await this.save(user);
	}

	async updateUserAsLeave(user: UserDto): Promise<void> {
		user.isLeave = true;
		await this.save(user);
	}

	async findNickname(nickname: string): Promise<number> {
		return await this.count({ where: { nickname } });
	}

	async findUsersByKeyword(keyword: string): Promise<UserDto[]> {
		return await this.find({ where: { nickname: Like(`${keyword}%`) } });
	}

	async findUserById(id: number): Promise<UserDto | null> {
		return await this.findOneBy({ id: id });
	}

	async findUserByIntraId(id: string): Promise<UserDto> {
		return await this.findOneBy({ intraId: id });
	}

	async findUserIdByIntraId(id: string): Promise<number> {
		const user = await this.findOneBy({ intraId: id });

		return user.id;
	}

	async hasLeave(id: number): Promise<boolean> {
		const user = await this.findOne({ where: { id } });
		if (user) {
			return user.isLeave;
		}
		return false;
	}
}
