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
import { AuthJwtGuard } from './guards/jwt-guard';
import { UserDto } from 'src/user/dto/user.dto';
import { GetUser } from './decorators/user-info';

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
		console.log('redirection 된 뒤');
		const auth: AuthType = await this.authService.validateUser(req.user);

		switch (auth) {
			case AuthType.NOUSER:
				console.log('회원가입을 해야합니다.');
				res.cookie('user-data', JSON.stringify(req.user));
				res.redirect(
					`${process.env.DOMAIN}:${process.env.FRONT_PORT}/sign-up`
				);
				break;
			case AuthType.USERWITH2FA:
				res.cookie('2FA', JSON.stringify(true));
			case AuthType.USER:
				console.log('이미 회원입니다.');
				const token = await this.authService.createToken(req.user);
				res.cookie('access-token', token);
				res.redirect(`${process.env.DOMAIN}:${process.env.FRONT_PORT}`);
		}
	}

	@ApiOperation({ summary: '회원가입' })
	@Post('/signup')
	async signup(
		@Body() formData: any,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		await this.authService.signup(formData);
		const token = await this.authService.createToken(formData);
		// [추후 수정할지말지..]
		res.clearCookie('user-data');
		res.cookie('access-token', token);
		res.redirect(`${process.env.DOMAIN}:${process.env.FRONT_PORT}`);
		res.status(200).end();
	}

	@ApiOperation({ summary: 'jwt token을 사용해 user 반환받기' })
	@UseGuards(AuthJwtGuard)
	@Post('/user')
	async user(@GetUser() user: UserDto): Promise<UserDto | null> {
		console.log(user);
		return user;
	}
}
