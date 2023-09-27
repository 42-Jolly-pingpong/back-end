import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthFtGuard } from './guards/ft-guard';
import { Response } from 'express';
import { AuthType } from './enums/auth-type.enum';

@ApiTags('auth-controller')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'intra 권한 얻기' })
	@UseGuards(AuthFtGuard)
	@Get('/intra')
	async intra() {}

	@ApiOperation({ summary: 'intra 리다이렉트' })
	@UseGuards(AuthFtGuard)
	@Get('/intra/redirect')
	async intraRedirect(
		@Req() req: any,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		const auth: AuthType = await this.authService.validateUser(req.user);

		switch (auth) {
			case AuthType.NOUSER:
				res.cookie('user-data', [req.user.login, req.user.email]);
				res.redirect(
					`${process.env.DOMAIN}:${process.env.FRONT_PORT}/sign-up`
				);
				break;
			case AuthType.USERWITH2FA:
				res.cookie('2FA', true);
			case AuthType.USER:
				const token = await this.authService.createToken(req.user);
				res.cookie('access-token', token);
				res.redirect(`${process.env.DOMAIN}:${process.env.FRONT_PORT}`);
		}
	}
}
