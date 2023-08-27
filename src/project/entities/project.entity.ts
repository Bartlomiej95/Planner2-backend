import { Company } from "src/company/entities/company.entity";
import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('project')
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 256,
    })
    title: string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    customer: string;

    @Column({
        type: 'date',
    })
    deadline: Date;

    @Column({
        type: 'int',
    })
    hours: number;

    @Column({
        type: 'int',
    })
    value: number;

    @Column({
        type: 'text',
    })
    content: string;

    @Column({
        type: 'text',
    })
    assumptions: string;

    @ManyToMany(() => User, (user) => user.projects, { cascade: true })
    users: User[];

    @OneToMany(() => Task, (task) => task.id )
    tasks: Task[];

    @Column({
        type: 'varchar',
    })
    departments: string[];

    @ManyToOne(() => Company, (company) => company.id, { cascade: true} )
    company: Company;

    static async findProjectsByUser(userId: string) {

        const result = await this.createQueryBuilder('project')
            .leftJoinAndSelect('project.users', 'users')
            .getMany();
       
        const projectsWithUsers = result.filter(project => project.users.length !== 0);
        const searchingProjects = projectsWithUsers.map(project => {
            let checkIfExist = false; 
            project.users.forEach(user => {
                if(user.id === userId){
                    checkIfExist = true;
                }
            });

            if(checkIfExist){
                return project
            } else {
                return null;
            }
        }).filter(project => project);
                
        return searchingProjects;
    }

    static async findProjectsByCompany(companyId: string){
        const result = await this.createQueryBuilder('project')
            .leftJoinAndSelect('project.company', 'company')
            .leftJoinAndSelect('project.users', 'users')
            .getMany();
        
        const projectsWithCompany = result.filter(project => project.company).filter(project => project.company.id === companyId);

        return projectsWithCompany;
    }
}