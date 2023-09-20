import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth-controller')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
}
