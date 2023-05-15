import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError } from 'rxjs';
import { validateProjectData } from 'src/common/utils/validate-project';
import { User } from 'src/user/entities/user.entity';
import { ArrayContains, In } from 'typeorm';
import { CreateNewProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class ProjectService {
    constructor(){}

    async createNewProject(data: CreateNewProjectDto, user: User,  res: Response): Promise<{ok: boolean, message: string, title: string | null}> {
        try {
            
            const validation = await validateProjectData(data);

            const userExtendCompany = await User.extendUserCompany(user.id);
            const companyId = userExtendCompany.company.id;
            const searchedCompany = await Company.findOne({ where: { id: companyId }});

            if(!searchedCompany){
                res.json({
                    ok: false,
                    message: "Musisz należeć do jakiejś grupy żeby założyć projekt",
                    title: '',
                });

                return {
                    ok: false,
                    message: "Musisz należeć do jakiejś grupy żeby założyć projekt",
                    title: '',
                }
            }

            if(!validation.ok){
                res.json({
                    ok: validation.ok,
                    message: validation.message,
                    title: validation.title,
                })
            } else {
                const project = new Project();
                project.assumptions = data.assumptions;
                project.content = data.content;
                project.customer = data.customer;
                project.deadline = data.deadline;
                project.departments = data.departments;
                project.hours = data.hours;
                project.title = data.title;
                project.value = data.value;
                project.company = searchedCompany;

                const user = await User.findBy({ id: In([data.users])});
                project.users = [...user];

                await project.save();            

                res.status(200)
                    .json({
                        ok: true,
                        title: project.title,
                        message: 'Stworzono nowy projekt',
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
            updatedProject.value = data.value;

            const user = await User.findBy({ id: In([data.users])});
            updatedProject.users.push(...user);

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
