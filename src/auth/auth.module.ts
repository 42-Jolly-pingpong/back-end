import { Module } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthFtStrategy } from 'src/auth/strategies/ft-strategy';
import { AuthJwtStrategy } from 'src/auth/strategies/jwt-strategy';

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '7d' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, AuthFtStrategy, AuthJwtStrategy, UserRepository],
	exports: [JwtModule],
})
export class AuthModule {}
