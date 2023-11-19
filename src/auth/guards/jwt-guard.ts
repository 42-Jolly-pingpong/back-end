import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info, context) {
		if (!user) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		} else if (err) {
			console.log('authJwtGuard error');
			return;
		}
		return user;
	}
}
