import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthFtGuard extends AuthGuard('ft') {
	handleRequest(err, user, info, context) {
		if (err) {
			const response = context.switchToHttp().getResponse();
			response.redirect(
				`${process.env.DOMAIN}:${process.env.FRONT_PORT}`
			);
		}
		return user;
	}
}
