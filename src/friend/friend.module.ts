import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendRepository } from './repositories/friend.repository';
import { BlockedFriendRepository } from './repositories/blocked-friend.repository';
import { FriendRequestRepository } from './repositories/friend-request.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Friend])],
	controllers: [FriendController],
	providers: [
		FriendService,
		FriendRepository,
		BlockedFriendRepository,
		FriendRequestRepository,
	],
})
export class FriendModule {}
