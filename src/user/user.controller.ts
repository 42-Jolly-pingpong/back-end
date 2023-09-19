import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameHistoryDto } from 'src/game/dto/game-history.dto';
import { GameService } from 'src/game/game.service';
import { UserDto } from './dto/user.dto';

@ApiTags('user-controller')
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly gameService: GameService
	) {}

	@ApiOperation({ summary: '유저 정보 DB 등록' })
	@Post('/')
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@ApiOperation({ summary: '유저 ID를 이용한 유저정보 찾기' })
	@Get('/:userIdx')
	findOne(@Param('userIdx') id: number) {
		return this.userService.findOne(+id);
	}

	@ApiOperation({ summary: 'id를 이용한 게임 전적 불러오기 ' })
	@Post('/:userIdx/history')
	async findGameHistoryByUserIdx(
		@Param('userIdx') userIdx: number
	): Promise<GameHistoryDto[]> {
		return await this.gameService.getGameHistoryByuserIdx(userIdx);
	}
}
