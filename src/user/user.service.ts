import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserInfoDTO } from './dto/UserInfo.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository) private userRepository: UserRepository
	) {}

	create(createUserDto: CreateUserDto) {
    this.userRepository.createUserInfo(createUserDto);
  }

	findAll() {
		return `This action returns all user`;
	}

	async findOne(id: number): Promise<UserInfoDTO> {
    const userInfo: UserInfoDTO = await this.userRepository.getUserInfobyIdx(id)
    console.log(userInfo)
    if (!userInfo)
      throw new NotFoundException();
		return userInfo;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(idx: number) {
		this.userRepository.deleteUserInfobyIdx(idx);
	}
}
