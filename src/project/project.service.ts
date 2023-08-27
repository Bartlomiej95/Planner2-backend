import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { validateProjectData } from 'src/common/utils/validate-project';
import { User } from 'src/user/entities/user.entity';
import { In } from 'typeorm';
import { CreateNewProjectDto, UpdateProjectDto } from './dto/create-project.dto';
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

    async getProject(id: string, res: Response): Promise<Project>{
        try {
            const searchedProject = await Project.findOne({ where: { id }, relations: ['users'] });

            res.status(200).json({ ok: true, message: "Poprawnie pobrano projekt", project: searchedProject})

            return searchedProject;
        } catch (error) {
            res.status(500)
                .json({ ok: false, message: "Błąd serwera", project: null})
        }
        return await Project.findOne({where: {id}});
    }

    async updateProject(data: UpdateProjectDto, res: Response) {
        try {
            const { id } = data;
            if(!id) throw new NotFoundException("Nie ma takiego projektu");
            const updatedProject = await Project.findOne({where: {id}});
            if(!updatedProject) throw new NotFoundException('Nie ma takiego projektu');

            const validation = await validateProjectData(data);
            if(!validation.ok){
                return res.status(500)
                    .json({ message: validation.message, ok: false})
            } 

            updatedProject.assumptions = data.assumptions;
            updatedProject.content = data.content;
            updatedProject.customer = data.customer;
            updatedProject.deadline = data.deadline;
            updatedProject.departments = data.departments;
            updatedProject.hours = data.hours;
            updatedProject.title = data.title;
            updatedProject.value = data.value;

            console.log('po update', updatedProject);
            const searchedUsers = [];

            for(let i = 0; i < data.users.length; i++ ) {
                const user = await User.findBy({ id: In([data.users[i]])});
                console.log(user);
                searchedUsers.push(...user);
            }
            updatedProject.users = searchedUsers;

            console.log('po dodaniu userów', updatedProject);

            await updatedProject.save();
            
            return res.status(200)
                .json({ 
                    message: `Projekt ${updatedProject.title} został zaktualizowany`,
                    ok: true
                })
            
        } catch (error) {
            res.status(500)
                .json({ message: error.message ?? "Błąd serwera", ok: false})
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

    async fetchAllProjects(user: User, res: Response){
        try {
            const userExtendCompany = await User.extendUserCompany(user.id);
            const companyId = userExtendCompany.company.id;

            if(!companyId) throw new NotFoundException("Musisz należeć do jakiejś grupy żeby założyć projekt");

            const projects = await Project.findProjectsByCompany(companyId);
            return res.json({projects})
            
            
        } catch (error) {
            res.status(500).json({ message: "Błąd serwera" })
        }
    }

    async fetchProjectsAssingToUser(userId: string, res: Response){
        try {
            if(!userId){
                return res.status(400).json({
                    ok: false, 
                    projects: null,
                    message: "Nie ma takiego użytkownika",
                })
            } else {
                const searchedProjects = await Project.findProjectsByUser(userId);
                return res.status(200).json({
                    ok: true,
                    projects: searchedProjects,
                    message: "Załadowano projekty",
                })
            }

        } catch (error) {
            res.status(500).json({ message: "Błąd serwera"});
        }
    }
}
