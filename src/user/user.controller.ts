import { Controller, Get, Inject, Param, UseGuards, Patch, Body, Res} from '@nestjs/common';
import { Response } from 'express';
import { UserObj } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserOwnerGuard } from 'src/common/guards/user-owner.guard';
import { ChangePasswordResponse, Role } from 'src/types/user.type';
import { changePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        @Inject(UserService) private userService: UserService,
    ) {}
    
    @Get('/')
    @UseGuards(JwtAuthGuard, UserOwnerGuard)
    async getUser(
      @UserObj() user
    ): Promise<User> {
      return this.userService.getUser(user)
    }

    @Get('/projects')
    @UseGuards(JwtAuthGuard)
    async getProjectsForUser(
        @Res() res: Response,
        @UserObj() user: User,
    ){
        return await this.userService.getProjectsForUser(user, res);
    }

    @Patch('/changepass')
    @UseGuards(JwtAuthGuard)
    async changePassword(
      @UserObj() user: User,
      @Body() changePasswordDto: changePasswordDto,
      @Res() res: Response,
    ) {
      return await this.userService.changePassword(user, changePasswordDto, res)
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard, UserOwnerGuard)
    async getUserProfile(
      @UserObj() user: User,
      @Res() res: Response,
    ) {
      return await this.userService.showUserProfile(user, res)
    }
}
