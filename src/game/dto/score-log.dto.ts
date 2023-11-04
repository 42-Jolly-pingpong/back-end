import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";

export class ScoreLogDto {
	@ApiProperty({ description: '방 이름'})
	roomName: string;

	@ApiProperty({ description: '점수 낸 시간'})
	elapsedTime: number;

	@ApiProperty({ description: '점수 낸 유저'})
	user: User;
}