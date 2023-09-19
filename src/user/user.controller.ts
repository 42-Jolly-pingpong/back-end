import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameHistoryDto } from 'src/game/dto/game-history.dto';
import { GameService } from 'src/game/game.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
	@Get('/:userIdx')
	async getUser(@Param('userIdx') idx: number): Promise<UserDto> {
		return await this.userService.getUserByUserIdx(+idx);
	}

	@ApiOperation({ summary: '유저정보 업데이트' })
	@Patch('/:userIdx')
	async updateUser(
		@Param('userIdx') idx: number,
		@Body() updateUserDto: UpdateUserDto
	): Promise<void> {
		return await this.userService.updateUser(+idx, updateUserDto);
	}

	@ApiOperation({ summary: '회원 탈퇴' })
	@Patch('/:userIdx/leave')
	async withdrawUser(@Param('userIdx') idx: number): Promise<void> {
		return await this.userService.withdrawUser(+idx);
	}

	@ApiOperation({ summary: '게임 전적 불러오기 ' })
	@Post('/:userIdx/history')
	async getGameHistoryByUserIdx(
		@Param('userIdx') idx: number
	): Promise<GameHistoryDto[]> {
		return await this.gameService.getGameHistoryByUserIdx(+idx);
	}
}
