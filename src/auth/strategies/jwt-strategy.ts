import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserDto } from 'src/user/dto/user.dto';

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
		//console.log(payload);
		const user: UserDto = await this.authService.getUserById(+payload.id);

		if (user === null) {
			throw new HttpException('Invalid User', HttpStatus.BAD_REQUEST);
		}

		return user;
	}
}
