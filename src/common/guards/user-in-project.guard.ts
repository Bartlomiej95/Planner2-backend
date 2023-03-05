import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { Reflector } from '@nestjs/core';
import { Project } from 'src/project/entities/project.entity';
import { Role } from 'src/types/user.type';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserInProjectGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
   
    const request = context.switchToHttp().getRequest();
    const projectId = request.params?.id;
    const user = request.user as User;
    
    if(user.role === Role.manager || user.role === Role.owner){
      return true;
    }

    if(!user) throw new NotFoundException();
    
    const project = await Project.findOne({ where: {id: projectId}});
    console.log(project);

    return project.users.includes(user.id);

  }
}