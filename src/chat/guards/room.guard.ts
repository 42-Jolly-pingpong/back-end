import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class RoomGuard implements CanActivate {
	constructor(private chatService: ChatService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roomIdx = parseInt(
			context.switchToHttp().getRequest().params['roomIdx']
		);
		return this.validate(roomIdx) && this.chatService.checkIfRoomExist(roomIdx);
	}

	validate(roomIdx: number) {
		if (isNaN(roomIdx)) {
			return false;
		}
		return true;
	}
}
