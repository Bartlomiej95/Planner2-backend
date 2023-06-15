import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tasks')
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100
    })
    title: string;

    @Column({
        type: 'varchar',
        length: 256,
    })
    brief: string;

    @Column({
        type: 'text',
    })
    guidelines: string;

    @Column({
        type: 'int',
    })
    currentTime: number;

    @Column({
        type: 'int',
    })
    taskTime: number;

    @Column()
    isActive: boolean;

    @Column()
    isFinish: boolean;

    @ManyToOne(() => Project, (project) => project.id)
    project: Project;

    @ManyToOne(() => User, (user) => user.id)
    user: User;
}