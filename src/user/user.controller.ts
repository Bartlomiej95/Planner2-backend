import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        @Inject(UserService) private userService: UserService,
      ) {}

      @Get('/:id')
      @UseGuards(JwtAuthGuard)
      async getUser(
        @Param('id') id: string
      ): Promise<User> {
        return this.userService.getUser(id)
      }
}
