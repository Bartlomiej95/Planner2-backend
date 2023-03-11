import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { hashPwd } from 'src/common/utils/hashPwd';
import { Project } from 'src/project/entities/project.entity';
import { ChangePasswordResponse } from 'src/types/user.type';
import { Not, IsNull, In} from 'typeorm';
import { changePasswordDto } from './dto/change-password.dto';
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

    async changePassword(id: string, changePasswordDto: changePasswordDto ): Promise<ChangePasswordResponse> {
        if(!id) throw new BadRequestException();

        const user = await User.findOne({ where: { id }});
        if(!user) throw new NotFoundException()

        const { password, newPassword, replyNewPassword } = changePasswordDto;
        const hashCompareResult = await compare(password, user.password);

        if(hashCompareResult){
            if(newPassword === replyNewPassword){
                user.password = newPassword ? await hashPwd(newPassword) : user.password;
                await user.save();

            } else throw new Error('Nowe hasło i powtórzone hasło muszą być identyczne');
   
        } else throw new UnauthorizedException();

        return { ok: true }
    }

    async getProjectsForUser(user: User, res: Response){
        try {

            const projects = await Project.findProjectsByUser(user.id);

            if(projects.length === 0){
                res.json({msg: "Nie masz żadnych projektów"});
            }

            const searchingProjects = await Project.find({ where: { id: In([projects])}})

            res.status(200)
                .json({
                    projects: searchingProjects,
                });

        } catch (error) {
            res.status(500)
                .json('Błąd serwera');
        }
    }

    async showUserProfile (user: User, res: Response) {
        try {
            if(!user) throw new NotFoundException();

            const { lastName, firstName, department, position, company  } = user;

            res.status(200)
                .json({
                    user: {
                        lastName,
                        firstName,
                        department,
                        position,
                        company,
                    }
                })
            
        } catch (error) {
            res.status(500)
                .json('Błąd serwera');
        }
    }
}
