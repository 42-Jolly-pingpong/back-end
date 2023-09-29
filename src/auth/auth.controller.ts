import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthFtGuard } from './guards/ft-guard';
import { Response } from 'express';
import { AuthType } from './enums/auth-type.enum';
import { type } from 'os';

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
				res.cookie('user-data', JSON.stringify(req.user));
				res.redirect(
					`${process.env.DOMAIN}:${process.env.FRONT_PORT}/sign-up`
				);
				break;
			case AuthType.USERWITH2FA:
				res.cookie('2FA', JSON.stringify(true));
			case AuthType.USER:
				const token = await this.authService.createToken(req.user);
				res.cookie('access-token', token);
				res.redirect(`${process.env.DOMAIN}:${process.env.FRONT_PORT}`);
		}
	}

	@ApiOperation({ summary: '회원가입' })
	@Post('/signup')
	async signup(@Body() formData: any, @Res() res: Response): Promise<void> {
		await this.authService.signup(formData);
		//const token = await this.authService.createToken(formData.intraId);
		res.clearCookie('user-data');
		//res.cookie('access-token', token);
		res.status(200).end();
		//res.redirect(`${process.env.DOMAIN}:${process.env.FRONT_PORT}`);
	}

	@ApiOperation({ summary: 'jwt decode' })
	@Post('/decoded-token')
	test(@Body() formData: string, @Res() res: Response) {
		console.log('들어왔어.');
		console.log(formData);
		res.status(200).send('hi');
	}
}