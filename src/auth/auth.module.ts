import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from 'src/common/providers/mail/mail.module';
import { LocalStrategy } from './local.strategy';
import { config } from 'src/config/config';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [MailModule, UserModule, PassportModule, JwtModule.register({
    secret: config.jwtSecret,
    signOptions: { expiresIn: config.jwtTimeToExpire },
  }),],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService]
})
export class AuthModule {}
