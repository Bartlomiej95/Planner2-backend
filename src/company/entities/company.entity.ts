import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('company')
export class Company extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    name: string;

    @Column({
        type: 'bigint',
        unique: true,
    })
    nip: number;

    @OneToOne(() => User)
    @JoinColumn()
    administrator: User;

    @OneToMany(() => User, (user) => user.id)
    users: User[];

}