import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository) private userRepository: UserRepository
	) {}

	async create(createUserDto: CreateUserDto): Promise<void> {
		await this.userRepository.createUserInfo(createUserDto);
	}

	async findOne(idx: number): Promise<UserDto> {
		const user: UserDto = await this.userRepository.getUserByUserIdx(idx);
		if (!user) {
			throw new NotFoundException();
		}
		return user;
	}
}
