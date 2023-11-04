import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from 'src/app.service';

@ApiTags('main')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiOperation({ summary: '루트 페이지' })
	@Get('/')
	async root(): Promise<void> {}
}
