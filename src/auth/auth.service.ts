import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	async validateUser(data: any): Promise<AuthType> {
		const user = await this.userRepository.findUserByIntraId(data.intraId);
		if (user) {
			return user.auth === true ? AuthType.USERWITH2FA : AuthType.USER;
		}
		return AuthType.NOUSER;
	}

	async createToken(data: any): Promise<string> {
		const id = await this.userRepository.findUserIdByIntraId(data.intraId);
		const payload = { id };
		return this.jwtService.sign(payload);
	}

	async signup(data: CreateUserDto): Promise<void> {
		await this.userRepository.createUser(data);
	}

	async getUserById(id: number): Promise<UserDto | null> {
		return await this.userRepository.findUserById(id);
	}

	async getUserByIdFromToken(token: string): Promise<User> {
		const payload = this.jwtService.verify(token);
		if (!payload.id) {
			return null;
		}

		const user = this.getUserById(payload.id);
		return user;
	}
}
