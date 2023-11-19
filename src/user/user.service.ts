import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository) private userRepository: UserRepository
	) {}

	async create(createUserDto: CreateUserDto): Promise<void> {
		await this.userRepository.createUser(createUserDto);
	}

	async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
		const user: UserDto = await this.userRepository.findUserById(id);
		await this.userRepository.updateUser(user, updateUserDto);
	}

	async withdrawUser(id: number): Promise<void> {
		const user: UserDto = await this.userRepository.findUserById(id);
		await this.userRepository.updateUserAsLeave(user);
	}

	async checkNicknameDuplicate(nickname: string): Promise<boolean> {
		const count: number = await this.userRepository.findNickname(nickname);
		return count > 0;
	}

	async getUsersByKeyword(keyword: string): Promise<UserDto[]> {
		return await this.userRepository.findUsersByKeyword(keyword);
	}

	async getUserById(id: number): Promise<UserDto> {
		const user: UserDto = await this.userRepository.findUserById(id);
		if (!user) {
			throw new NotFoundException();
		}
		return user;
	}
}
