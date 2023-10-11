import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info, context) {
		if (err || !user) {
			const response = context.switchToHttp().getResponse();
			response.redirect(
				`${process.env.DOMAIN}:${process.env.FRONT_PORT}`
			);
		}
		return user;
	}
}
