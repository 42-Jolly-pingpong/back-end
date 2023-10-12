import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info, context) {
		if (err || !user) {
			return;
		}
		return user;
	}
}
