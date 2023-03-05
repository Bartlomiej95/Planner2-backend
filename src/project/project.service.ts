import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { validateProjectData } from 'src/common/utils/validate-project';
import { CreateNewProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
    constructor(){}

    async createNewProject(data: CreateNewProjectDto, res: Response): Promise<{ok: boolean, message: string, title: string | null}> {
        try {
            const validation = await validateProjectData(data);

            if(!validation.ok){
                return {
                    ok: validation.ok,
                    message: validation.message,
                    title: validation.title,
                }
            } else {
                const project = new Project();

                project.assumptions = data.assumptions;
                project.content = data.content;
                project.customer = data.customer;
                project.deadline = data.deadline;
                project.departments = data.departments;
                project.hours = data.hours;
                project.title = data.title;
                project.users = data.users;
                project.value = data.value;

                await project.save();

                res.status(200)
                    .json({
                    message: "Stworzono nowy projekt"
                });

                return {
                    ok: true,
                    title: project.title,
                    message: 'Stworzono nowy projekt',
                }
            }

        } catch (error) {
            res.status(500)
                .json({ message: "Błąd serwera"})
        }
    }

    async getProject(id: string){

    }
}
