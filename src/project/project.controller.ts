import { Controller, Inject, Get, Param, Post, Body, UseGuards, Res, Patch, Delete } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { ProjectService } from './project.service';
import { UseRoles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/types/user.type';
import { CreateNewProjectDto } from './dto/create-project.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Project } from './entities/project.entity';
import { UserInProjectGuard } from 'src/common/guards/user-in-project.guard';

@Controller('project')
export class ProjectController {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(ProjectService) private projectService: ProjectService,
    ) {}

    @Get('/:id')
    @UseGuards(JwtAuthGuard, UserInProjectGuard)
    @UseRoles(Role.manager, Role.owner, Role.user)
    async getProject(
        @Param('id') id: string,
    ): Promise<Project>{
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

    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    @UseRoles(Role.manager, Role.owner)
    async updateProject(
        @Body() data: Project,
        @Res() res: Response,
        @Param('id') id: string,
    ){
        // return await this.projectService.updateProject(id, data, res)
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
