import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Response } from 'express';
import { validateTaskData } from 'src/common/utils/validate-task';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateNewTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
    constructor() {}

    async getTask(id: string, res: Response){
        try {
            const task = await Task.find({ where: { id }});
            if(!task) throw new NotFoundException();

            res.json({task})
            
        } catch (error) {
            res.status(500)
                .json('Błąd serwera')
        }
    }

    async createNewTask(task: CreateNewTaskDto, res: Response){
        try {
            const validate = await validateTaskData(task);
       
            if(!validate.ok){
                res.status(400)
                    .json({
                        ok: validate.ok,
                        message: validate.message,
                        title: validate.title,
                        task: null,
                    })
                return null;
            }

            const project = await Project.findOne({ where: { id: task.project} });
            const user = await User.findOne({ where: { id: task.user }});

            if(!project) throw new NotFoundException('Zadanie musi być przypisane do konkretnego projektu!');
            if(!user) throw new NotFoundException('Musisz wyznaczyć osobę do tego zadania');

            const newTask = new Task();
            newTask.title = task.title;
            newTask.brief = task.brief;
            newTask.currentTime = 0;
            newTask.taskTime = task.taskTime;
            newTask.guidelines = task.guidelines;
            newTask.isActive = false;
            newTask.isFinish = false;
            newTask.project = project;
            newTask.user = user;

            await newTask.save();

            res.status(200)
                .json({
                    ok: true,
                    message: `Dodano nowe zadanie ${newTask.title} do użytkownika ${user.firstName} ${user.lastName}`,
                    title: newTask.title,
                    task,
                })
            
        } catch (error) {
            res.status(500)
                .json(error.message)
        }
    }

    async updateTask(id: string, task: UpdateTaskDto, res: Response){
        try {
            const updatedTask = await Task.findOne({where: { id }});
            if(!updatedTask) throw new NotFoundException('Nie ma takiego zadania');

            const project = await Project.findOne({ where: { id: task.project} });
            const user = await User.findOne({ where: { id: task.user }});

            if(!project) throw new NotFoundException('Zadanie musi być przypisane do konkretnego projektu!');
            if(!user) throw new NotFoundException('Musisz wyznaczyć osobę do tego zadania');

            // We can't update task which is already active - it means that someone is working on it
            if(updatedTask.isActive){
                res.status(409)
                    .json({ error: "Zadanie jest aktywne"});
                return;
            }

            updatedTask.title = task.title;
            updatedTask.brief = task.brief;
            updatedTask.currentTime = task.currentTime;
            updatedTask.guidelines = task.guidelines;
            updatedTask.project = project;
            updatedTask.user = user;

            await updatedTask.save();

            res.status(200)
                .json({
                    ok: true, 
                    message: `Zadanie ${updatedTask.title} zostało zaktualizowane`,
                })

        } catch (error) {
            res.status(500)
                .json(error.message)
        }
    }

    async removeTask(id: string, res: Response){
        try {
            const searchingTask = await Task.findOne({where: { id }});
            if(!searchingTask) throw new NotFoundException('Nie ma takiego zadania');
            
            await searchingTask.remove();

            res.status(200)
                .json({
                    ok: true, 
                    message: `Poprawnie usunięto zadanie ${searchingTask.title}`,
                })

        } catch (error) {
            res.status(500)
                .json(error.message)
        }
    }

    async toggleActiveStatus(id: string, res: Response){
        try {
            const updatedTask = await Task.findOne({where: { id }});
            if(!updatedTask) throw new NotFoundException('Nie ma takiego zadania');

            updatedTask.isActive = !updatedTask.isActive;

            await updatedTask.save();
            res.status(200)
                .json('Zmieniono status zadania')
            
        } catch (error) {
            res.status(500)
                .json(error.message)
        }
    }

    async finishTask(id: string, res: Response){
        try {
            const searchingTask = await Task.findOne({where: { id }});
            if(!searchingTask) throw new NotFoundException('Nie ma takiego zadania');

            if(searchingTask.isFinish){
                res.status(400)
                    .json('Zadanie jest już zakończone. Jeśli chcesz poproś managera aby je otworzył');
                return;
            }

            searchingTask.isFinish = true;
            await searchingTask.save();
            
            res.status(200)
                .json('Pomyślnie zakończono zadanie')
            
        } catch (error) {
            res.status(500)
                .json(error.message)
        }
    }
}
