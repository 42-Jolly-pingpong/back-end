import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class RoomGuard implements CanActivate {
	constructor(private chatService: ChatService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roomId = parseInt(
			context.switchToHttp().getRequest().params['roomId']
		);
		return this.validate(roomId) && this.chatService.checkIfRoomExist(roomId);
	}

	validate(roomId: number) {
		if (isNaN(roomId)) {
			return false;
		}
		return true;
	}
}
