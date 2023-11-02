import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';

export const GetUser = createParamDecorator(
	(data: unknown, context: ExecutionContext): UserDto | null => {
		const request = context.switchToHttp().getRequest();
		return request.user;
	}
);
