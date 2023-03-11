import { Injectable, CanActivate, ExecutionContext, Inject, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/types/user.type';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserOwnerGuard implements CanActivate {
    constructor(@Inject(Reflector) private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // const handler = context.getHandler();
    const user = request.user as User;
    const ownerId = request.params?.id;
    
    if(!ownerId) throw new BadRequestException();
    if(!user) throw new Error('User is undefined');

    if(user.role === Role.manager || user.role === Role.owner){
      return true 
    } 
    
    return user.id === ownerId

  }
}