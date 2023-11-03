import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/auth/guards/jwt-guard';
import { GameService } from 'src/game/game.service';

@ApiTags('game-controller')
@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@ApiOperation({ summary: '점수 로그를 받아옴'})
	@UseGuards(AuthJwtGuard)
	@Get('score-log/:roomName')
	async getScoreLog(@Param('roomName') roomName: string) {
		return await this.gameService.getGameScoreLogByRoomName(roomName);
	}

	// @ApiOperation({ summary: '게임 종료 후 결과 생성' })
	// @Post('/history')
	// createGameHistory(): Promise<GameHistoryDto> {
	// 	return this.gameService.
	// }

	//	@Post()
	//	create(@Body() createGameDto: CreateGameDto) {
	//		return this.gameService.create(createGameDto);
	//	}

	//	@Get()
	//	findAll() {
	//		return this.gameService.findAll();
	//	}

	//	@Get(':id')
	//	findOne(@Param('id') id: string) {
	//		return this.gameService.findOne(+id);
	//	}

		// @Patch(':id')
		// update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
		// 	return this.gameService.update(+id, updateGameDto);
		// }

	//	@Delete(':id')
	//	remove(@Param('id') id: string) {
	//		return this.gameService.remove(+id);
	//	}
}
