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
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameHistoryDto } from 'src/game/dto/game-history.dto';
import { GameService } from 'src/game/game.service';

@ApiTags('user-controller')
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly gameService: GameService
	) {}

	@ApiOperation({ summary: '유저 정보 DB 등록' })
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		console.log('api');
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@ApiOperation({ summary: 'id를 이용한 유저정보 찾기' })
	@Get(':id')
	findOne(@Param('id') id: number) {
		console.log(id);
		console.log('api');
		return this.userService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}

	@Post('/:userIdx/history')
	async getUserGameHistory(
		@Param('userIdx') userIdx: number
	): Promise<GameHistoryDto[]> {
		return await this.gameService.getGameHistoryByuserIdx(userIdx);
	}
}
