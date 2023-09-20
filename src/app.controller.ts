import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('main')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiOperation({ summary: '루트 페이지' })
	@Get('/')
	async root(): Promise<void> {
		// 1. localStorage에 jwt 가 있는가?
		// 2. 있다면 -> 200번 -> main 페이지로 입장
		// 2-2. 없다면 -> 401번 -> welcome 페이지로 입장
		// 3. 로그인 버튼 눌러 -> redirect 하겠지.
		// 4. 프론트에서 API를 보내(/auth/intra) -> access-token 줘!
		// 4-2. 성공해 -> 200번. /sign-up 이동해!
		// 4-3. 실패해 ->xxx번하고, 다시 welcome 페이지로 redirect
		// 완벽해!
	}
}
