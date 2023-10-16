import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class RoomGuard implements CanActivate {
	constructor(private chatService: ChatService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (context.getType() === 'http') {
			const roomId = parseInt(
				context.switchToHttp().getRequest().params['roomId']
			);
			return this.validate(roomId) && this.chatService.checkIfRoomExist(roomId);
		}
		const { roomId } = context.switchToWs().getData();
		return this.validate(roomId) && this.chatService.checkIfRoomExist(roomId);
	}

	validate(roomId: number) {
		if (isNaN(roomId)) {
			return false;
		}
		return true;
	}
}
