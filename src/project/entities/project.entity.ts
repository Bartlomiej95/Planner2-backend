import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({
        type: 'varchar',
    })
    users: string[];

    @Column({
        type: 'varchar',
    })
    tasks: string[];

    @Column({
        type: 'varchar',
    })
    departments: string[];
}