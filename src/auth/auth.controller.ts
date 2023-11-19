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
import { authenticator } from 'otplib';

@ApiTags('auth-controller')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'intra 권한 얻기' })
	@UseGuards(AuthFtGuard)
	@Get('/intra')
	 intra() {
		return ;
	}

	@ApiOperation({ summary: 'intra 리다이렉트' })
	@UseGuards(AuthFtGuard)
	@Get('/intra/redirect')
	async intraRedirect(
		@Req() req: any,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		const auth: AuthType = await this.authService.validateUser(req.user);
		const url = `${process.env.DOMAIN}:${process.env.FRONT_PORT}`;

		// 회원가입
		if (auth === AuthType.NOUSER) {
			res.cookie('user-data', JSON.stringify(req.user));
			res.redirect(`${url}/sign-up`);
			return;
		}

		// 2FA 인증 or 로그인
		const token = await this.authService.createToken(req.user);
		res.cookie('access-token', token);
		if (auth === AuthType.USERWITH2FA) {
			res.redirect(`${url}/otp`);
		} else if (auth === AuthType.USER) {
			res.redirect(`${url}`);
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
	user(@GetUser() user: UserDto): UserDto {
		return user;
	}

	@ApiOperation({ summary: 'OTP 인증 시도' })
	@Post('/otp')
	async validOTP(@Req() req, @Body() body) {
		let token = req.headers.authorization;
		if (token) {
			token = token.split(' ')[1];
		}
		const { code } = body;
		const user = await this.authService.getUserByIdFromToken(token);
		const isValid = authenticator.verify({
			token: code,
			secret: user.secret,
		});
		return { isValid };
	}
}
