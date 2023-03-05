import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError } from 'rxjs';
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

    async getProject(id: string): Promise<Project>{
        return await Project.findOne({where: {id}});
    }

    async updateProject(id: string, data: CreateNewProjectDto, res: Response) {
        try {

            const updatedProject = await Project.findOne({where: {id}})
            if(!updatedProject) throw new NotFoundException('Nie ma takiego projektu');

            const validation = await validateProjectData(data);
            if(!validation.ok){
                res.status(500)
                    .json({ message: validation.message})
            } 

            updatedProject.assumptions = data.assumptions;
            updatedProject.content = data.content;
            updatedProject.customer = data.customer;
            updatedProject.deadline = data.deadline;
            updatedProject.departments = data.departments;
            updatedProject.hours = data.hours;
            updatedProject.title = data.title;
            updatedProject.users = data.users;
            updatedProject.value = data.value;

            await updatedProject.save();
            
            res.status(200)
                .json({ message: `Projekt ${updatedProject.title} został zaktualizowany`})
            
        } catch (error) {
            res.status(500)
                .json({ message: "Błąd serwera"})
        }
    }

    async deleteProject(id: string, res: Response){
        try {
            const project = await Project.findOne({ where: { id }});
            const title = project.title;
            if(!project) throw new NotFoundException('Nie znaleziono takiego projektu');

            project.remove();
            res.status(200)
                .json({ message: `Projekt ${title} został usunięty`});
            
        } catch (error) {
            res.status(500)
            .json({ message: "Błąd serwera"})
        }
    }
}
