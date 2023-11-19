import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { GameModule } from 'src/game/game.module';
import { UserModule } from 'src/user/user.module';
import { FriendModule } from 'src/friend/friend.module';
import { typeORMConfig } from 'configs/typeorm.config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(typeORMConfig),
		UserModule,
		FriendModule,
		ChatModule,
		GameModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
