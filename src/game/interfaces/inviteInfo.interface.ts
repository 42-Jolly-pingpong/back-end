import { UserDto } from "src/user/dto/user.dto";
import { GameMode } from "../enums/game-mode.enum";

export interface InviteInfo {
	user: UserDto;
	mode: GameMode;
}