import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendService } from 'src/friend/friend.service';
import { Friend } from 'src/friend/entities/friend.entity';
import { FriendController } from 'src/friend/friend.controller';
import { FriendRepository } from 'src/friend/repositories/friend.repository';
import { BlockedFriendRepository } from 'src/friend/repositories/blocked-friend.repository';
import { FriendRequestRepository } from 'src/friend/repositories/friend-request.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Friend])],
	controllers: [FriendController],
	providers: [
		FriendService,
		FriendRepository,
		BlockedFriendRepository,
		FriendRequestRepository,
		UserRepository,
	],
})
export class FriendModule {}
