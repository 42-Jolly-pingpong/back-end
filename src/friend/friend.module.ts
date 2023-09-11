import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendRepository } from './friend.repository';
import { BlockedFriendRepository } from './blockedFriend.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Friend])],
	controllers: [FriendController],
	providers: [FriendService, FriendRepository, BlockedFriendRepository],
})
export class FriendModule {}
