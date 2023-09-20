import { ApiProperty } from "@nestjs/swagger";

export class FriendRequestDTO {
	@ApiProperty({ description: '요청 보내는 유저' })
	senderId: number;

	@ApiProperty({ description: '요청 받는 유저' })
	receiverId: number;
}