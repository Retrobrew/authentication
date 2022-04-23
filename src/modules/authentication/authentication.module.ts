import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './local-auth-guard.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '600s'
      }
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
