import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column({
        type: 'varchar',
        length: 60,
        default: null,
    })
    firstName: string;

    @Column({
        type: 'varchar',
        length: 60,
        default: null,
    })
    lastName: string;
}