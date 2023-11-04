import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: any) {
		const user: UserDto = await this.authService.getUserById(+payload.id);

		if (user === null) {
			throw new HttpException('Invalid User', HttpStatus.BAD_REQUEST);
		}

		return user;
	}
}
