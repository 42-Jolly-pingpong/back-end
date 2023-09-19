import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository) private userRepository: UserRepository
	) {}

	async create(createUserDto: CreateUserDto): Promise<void> {
		await this.userRepository.createUser(createUserDto);
	}

	async updateUser(idx: number, updateUserDto: UpdateUserDto): Promise<void> {
		const user: UserDto = await this.userRepository.findUserByUserIdx(idx);

		await this.userRepository.updateUser(user, updateUserDto);
	}

	async getUserByUserIdx(idx: number): Promise<UserDto> {
		const user: UserDto = await this.userRepository.findUserByUserIdx(idx);
		if (!user) {
			throw new NotFoundException();
		}
		return user;
	}
}
