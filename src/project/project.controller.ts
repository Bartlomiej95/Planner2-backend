import { Controller, Inject, Get, Param, Post, Body, UseGuards, Res, Req, Patch, Delete } from '@nestjs/common';
import { Request, Response, response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { ProjectService } from './project.service';
import { UseRoles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/types/user.type';
import { CreateNewProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Project } from './entities/project.entity';
import { UserObj } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('project')
export class ProjectController {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(ProjectService) private projectService: ProjectService,
    ) {}

    @Get('/all')
    @UseGuards(JwtAuthGuard)
    @UseRoles(Role.manager, Role.owner)
    async fetchAllProjects(
        @UserObj() user: User,
        @Res() res: Response,
    ){
        return await this.projectService.fetchAllProjects(user, res);
    }

    @Get('/user')
    @UseGuards(JwtAuthGuard)
    async fetchProjectsForUser(
        @UserObj() user: User,
        @Res() res: Response,
    ){
        return await this.projectService.fetchProjectsAssingToUser(user.id, res);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    @UseRoles(Role.manager, Role.owner, Role.user)
    async getProject(
        @Param('id') id: string,
        @Res() res: Response,
    ): Promise<Project>{
        return await this.projectService.getProject(id, res)
    }

    @Post('/')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseRoles(Role.manager, Role.owner)
    async createNewProject(
        @Body() data: CreateNewProjectDto,
        @UserObj() user: User,
        @Res() res: Response,
    ): Promise<{ ok: boolean, message: string, title: string | null}> {
        return await this.projectService.createNewProject(data, user, res)
    }

    @Patch('/')
    @UseGuards(JwtAuthGuard)
    @UseRoles(Role.manager, Role.owner)
    async updateProject(
        @Body() data: UpdateProjectDto,
        @Res() res: Response,
    ){
        return await this.projectService.updateProject(data, res);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    @UseRoles(Role.manager, Role.owner)
    async deleteProject(
        @Param('id') id: string,
        @Res() res: Response,
    ){
        return await this.projectService.deleteProject(id, res)
    }
}
