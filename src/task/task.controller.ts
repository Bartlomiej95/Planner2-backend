import { Controller, Get, Inject, Param, Res, UseGuards, Body, Post, Patch, Delete } from '@nestjs/common';
import { Response } from 'express';
import { UseRoles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserOwnerGuard } from 'src/common/guards/user-owner.guard';
import { Role } from 'src/types/user.type';
import { CreateNewTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import { UserObj } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('task')
export class TaskController {
    constructor(
        @Inject(TaskService) private taskService: TaskService,
    ) {}

    @Get('/all')
    @UseGuards(JwtAuthGuard)
    async fetchAllTasks(
        @UserObj() user: User,
        @Res() res: Response,
    ){
        return await this.taskService.getAllTasks(user, res);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, UserOwnerGuard)
    async getTask(
        @Param('id') id: string,
        @Res() res: Response,
    ){
        return await this.taskService.getTask(id, res);
    }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    @UseRoles(Role.manager, Role.owner)
    async addNewTask(
        @Body() task: CreateNewTaskDto,
        @Res() res: Response,
    ){
        return await this.taskService.createNewTask(task, res)
    }

    @Patch('/:id')
    @UseGuards(JwtAuthGuard, UserOwnerGuard)
    async updateTask(
        @Param('id') id: string,
        @Body() task: UpdateTaskDto,
        @Res() res: Response,
    ){
        return await this.taskService.updateTask(id, task, res)
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    @UseRoles(Role.manager, Role.owner)
    async removeTask(
        @Param('id') id: string,
        @Res() res: Response,
    ){
        return await this.taskService.removeTask(id, res);
    }

    @Patch('/active/:id')
    @UseGuards(JwtAuthGuard, UserOwnerGuard)
    async toogleActiveTask(
        @Param('id') id: string,
        @Res() res: Response,
    ){
        return await this.taskService.toggleActiveStatus(id, res)
    }

    @Patch('/finish/:id')
    @UseGuards(JwtAuthGuard, UserOwnerGuard)
    async finishTask(
        @Param('id') id: string,
        @Res() res: Response,
    ){
        return await this.taskService.finishTask(id, res)
    }


}
