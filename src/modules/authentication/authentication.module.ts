import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './local-auth-guard.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: {
          expiresIn: '600s'
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
