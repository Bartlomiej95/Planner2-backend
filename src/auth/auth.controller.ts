import { Controller, Post, Res, Inject, UseGuards, Body, Delete, Req, Put } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserObj } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RegistrationDto } from './dto/registration.dto';
import { ActivationDto } from './dto/activation.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('')
export class AuthController {

    constructor(
        @Inject(AuthService) private authService: AuthService,
        @Inject(AuthService) private userService: UserService,
    ){}

    @Post('/login')
    async login(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
    ) {
        return this.authService.login(req, res)
    }

    @Post('/register')
    async userRegistration(
        @Body() req: RegistrationDto,
        @Res() res: Response
    ) {
        return await this.authService.register(req, res);
    }

    @Post('/activate')
    async activateUser(
        @Body() req: { data: ActivationDto},
        @Res() res: Response,
    ) {
        return await this.authService.activate(req, res );
    }

    @Delete('/logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @Res({ passthrough: true }) res: Response,
        @UserObj() user: User,
    ): Promise<{ok: boolean}> {

        return this.authService.logout(user, res);
    }

    @Put('/password')
    async resetPassword(
        @Body() data: string,
        @Res() res: Response,
    ) {
        return this.authService.resetPassword(data, res)
    };

    @Put('/password/restart')
    async newPasswordAfterRestart(
        @Body() data: ResetPasswordDto,
        @Res() res: Response,
    ){
        return this.authService.setNewPassAfterRestart(data, res)
    };
}
