import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthType } from './enums/auth-type.enum';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	async validateUser(data: any): Promise<AuthType> {
		const user = await this.userRepository.findUserByIntraId(data.login);

		if (user) {
			if (user.auth === true) {
				return AuthType.USERWITH2FA;
			}
			return AuthType.USER;
		}
		return AuthType.NOUSER;
	}

	async createToken(data: any): Promise<string> {
		const id = await this.userRepository.findUserIdByIntraId(data.login);
		const payload = { id };
		return this.jwtService.sign(payload);
	}
}
