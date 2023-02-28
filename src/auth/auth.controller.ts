import { Controller, Post, Res, Inject, UseGuards, Body } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserObj } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RegistrationDto } from './dto/registration.dto';
import { ActivationDto } from './dto/activation.dto';

@Controller('')
export class AuthController {

    constructor(
        @Inject(AuthService) private authService: AuthService,
        @Inject(AuthService) private userService: UserService,
    ){}

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    async login(
        @Res({ passthrough: true }) res: Response,
        @UserObj() user: User,
    ) {
        return this.authService.login(user, res)
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
        @Body() req: ActivationDto,
        @Res() res: Response
    ) {
        return await this.authService.activate(req, res);
    }
}
