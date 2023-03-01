import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(){ }

    async getUser(id: string): Promise<User> {
        if(!id) throw new BadRequestException();

        const user = await User.findOne( { where: { id }});
        if(!user) throw new NotFoundException();

        return user;
    }
}
