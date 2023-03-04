import { Module } from '@nestjs/common';
import { join } from 'path';
require('dotenv').config();
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [MailerModule.forRoot({
    transport: {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },   
    // secure: true,
    defaults: {
      from: 'no-reply@localhost.pl',
    },
    template: {
      dir: join(__dirname, '../../../../src/common/providers/mail/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  })],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
