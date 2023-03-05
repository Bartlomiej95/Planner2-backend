import { Controller, Inject, Get, Param, Post, Body, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { ProjectService } from './project.service';
import { UseRoles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/types/user.type';
import { Request, Response } from 'express';
import { CreateNewProjectDto } from './dto/create-project.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('project')
export class ProjectController {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(ProjectService) private projectService: ProjectService,
    ) {}

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async getProject(
        @Param('id') id: string,
    ){
        return await this.projectService.getProject(id)
    }

    @Post('/')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseRoles(Role.manager, Role.owner)
    async createNewProject(
        @Body() data: CreateNewProjectDto,
        @Res() res: Response,
    ): Promise<{ ok: boolean, message: string, title: string | null}> {
        return await this.projectService.createNewProject(data, res)
    }
    

}
