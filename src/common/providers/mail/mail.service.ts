import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface ForgotPasswordContext {
    forgotPasswordUrl: string;
}

interface ActivateUrlContext {
    activateAccountUrl: string;
}

@Injectable()
export class MailService {
    constructor(@Inject(MailerService) private mailerService: MailerService) {}

    async sendForgotPassword(to: string, context: ForgotPasswordContext): Promise<void> {
        await this.mailerService.sendMail({
            to,
            subject: 'Planner - reset hasła',
            template: 'forgot-password',
            context,
        });
    }

    async sendActivationUrl(to: string, context: ActivateUrlContext): Promise<void> {
        await this.mailerService.sendMail({
            to,
            subject: 'Planner - activation link',
            template: 'activate-account',
            context,
        });
    }
}
