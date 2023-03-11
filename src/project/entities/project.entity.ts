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

    static async findProjectsByUser(userId: string) {

        const result = await this.createQueryBuilder('project')
            .leftJoinAndSelect('project.users', 'users')
            .getMany();
       
        const projectsWithUsers = result.filter(project => project.users.length !== 0);
        const searchingProjects = projectsWithUsers.map(project => {
            if(project.users.filter(user => user.id === userId)){
                return project.id;
            }
        });
                
        return searchingProjects;
    }
}