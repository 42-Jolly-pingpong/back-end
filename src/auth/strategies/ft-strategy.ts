import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthFtStrategy extends PassportStrategy(Strategy, 'ft') {
	constructor(private readonly authService: AuthService) {
		super({
			authorizationURL: `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.FT_UID}$redirect_uri=${process.env.FT_REDIRECT_URL}&response_type=code`,
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: process.env.FT_UID,
			clientSecret: process.env.FT_SECRET,
			callbackURL: process.env.FT_REDIRECT_URL,
		});
	}

	async validate(accessToken: string) {
		try {
			const userData = await fetch('https://api.intra.42.fr/v2/me', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}).then((res) => res.json());

			//const data = [userData.login, userData.email];
			return { intraId: userData.login, email: userData.email };
		} catch (e) {
			console.log(e);
		}
	}
}
