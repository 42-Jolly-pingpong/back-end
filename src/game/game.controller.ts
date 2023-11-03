import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from 'src/game/game.service';

@ApiTags('game-controller')
@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

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
