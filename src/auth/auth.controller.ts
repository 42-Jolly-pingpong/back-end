import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthFtGuard } from 'src/auth/guards/ft-guard';
import { GetUser } from 'src/auth/decorators/user-info';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AuthJwtGuard } from 'src/auth/guards/jwt-guard';

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
		@Req() req: any,
		@Body() formData: any,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		await this.authService.signup(formData);
		const token = await this.authService.createToken(formData);
		console.log('회원가입 중');
		res.cookie('access-token', token);
		res.clearCookie('user-data');
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	}

	@ApiOperation({ summary: '로그아웃' })
	@Get('/signout')
	async signout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
		console.log('로그아웃 로직 들어옴');
		res.clearCookie('access-token');
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	}

	@ApiOperation({ summary: 'jwt token을 사용해 user 반환' })
	@UseGuards(AuthJwtGuard)
	@Post('/user')
	async user(@GetUser() user: UserDto): Promise<UserDto | null> {
		//console.log(user);
		return user;
	}
}
