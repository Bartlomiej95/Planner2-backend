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

    @Get('/projects')
    @UseGuards(JwtAuthGuard)
    async getProjectsForUser(
        @Res() res: Response,
        @UserObj() user: User,
    ){
        return await this.userService.getProjectsForUser(user, res);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, UserOwnerGuard)
    async getUser(
      @Param('id') id: string
    ): Promise<User> {
      return this.userService.getUser(id)
    }

    @Patch('/:id/password')
    @UseGuards(JwtAuthGuard, UserOwnerGuard)
    async changePassword(
      @Param('id') id: string,
      @Body() changePasswordDto: changePasswordDto
    ): Promise<ChangePasswordResponse>{
      return await this.userService.changePassword(id, changePasswordDto)
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
