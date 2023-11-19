import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	HttpException,
	HttpStatus,
	UseGuards,
	Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { GameHistoryDto } from 'src/game/dto/game-history.dto';
import { AuthJwtGuard } from 'src/auth/guards/jwt-guard';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { GetUser } from 'src/auth/decorators/user-info';

@ApiTags('user-controller')
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly gameService: GameService
	) {}

	@ApiOperation({ summary: '새로운 유저 생성' })
	@Post('/')
	async create(@Body() createUserDto: CreateUserDto): Promise<void> {
		return await this.userService.create(createUserDto);
	}

	@ApiOperation({ summary: '유저정보 찾기' })
	@Get('/:id')
	async getUser(@Param('id') id: number): Promise<UserDto> {
		return await this.userService.getUserById(+id);
	}

	@ApiOperation({ summary: '유저정보 업데이트' })
	@UseGuards(AuthJwtGuard)
	@Patch('/')
	async updateUser(
		@GetUser() user: UserDto,
		@Body() updateUserDto: UpdateUserDto
	): Promise<void> {
		return await this.userService.updateUser(user.id, updateUserDto);
	}

	@ApiOperation({ summary: '회원 탈퇴' })
	@Patch('/:id/leave')
	async withdrawUser(@Param('id') id: number): Promise<void> {
		return await this.userService.withdrawUser(+id);
	}

	@ApiOperation({ summary: '게임 전적 불러오기 ' })
	@Get('/:id/history')
	async getGameHistoryById(
		@Param('id') id: number
	): Promise<GameHistoryDto[]> {
		const data = await this.gameService.getGameHistoryByUserId(+id);
		for (let i = 0; i < data.length; i++) {
			const scoreLogs = await this.gameService.getGameScoreLogByRoomName(
				data[i].roomName
			);
			data[i].scoreLogs = scoreLogs;
		}
		return data;
	}

	@ApiOperation({ summary: '유저 검색' })
	@Get('/search/:keyword')
	async getUsersByKeyword(
		@Param('keyword') keyword: string
	): Promise<UserDto[]> {
		return await this.userService.getUsersByKeyword(keyword);
	}

	@ApiOperation({ summary: '닉네임 중복 검사' })
	@Get('/nickname/:nickname')
	async checkNicknameDuplicate(
		@Param('nickname') nickname: string
	): Promise<void> {
		const isDuplicate = await this.userService.checkNicknameDuplicate(
			nickname
		);

		if (isDuplicate) {
			throw new HttpException('이거 나중에 핸들링', HttpStatus.CONFLICT);
		}
	}

	@ApiOperation({ summary: 'OTP 추가를 위한 QR 코드 생성' })
	@UseGuards(AuthJwtGuard)
	@Get('/:id/otp')
	async getOtp(@Param('id') id: number) {
		const user = await this.userService.getUserById(+id);
		// OTP 등록을 원하는 사용자 전용 시크릿 키
		const secret = authenticator.generateSecret();
		const url = authenticator.keyuri(
			String(user.id),
			`JOLLY PING PONG: ${user.email}`,
			secret
		);
		const qr_code = await toDataURL(url);
		return { secret, qr_code };
	}

	@ApiOperation({ summary: 'OTP 등록' })
	@UseGuards(AuthJwtGuard)
	@Post('/:id/otp')
	async registerOtp(@Param('id') id: number, @Body() body) {
		const { secret }: UpdateUserDto = body;

		return await this.userService.updateUser(+id, {
			auth: true,
			secret,
		});
	}

	@ApiOperation({ summary: 'OTP 삭제' })
	@UseGuards(AuthJwtGuard)
	@Delete('/:id/otp')
	async deleteOtp(@Param('id') id: number) {
		return await this.userService.updateUser(+id, {
			auth: false,
			secret: null,
		});
	}
}
