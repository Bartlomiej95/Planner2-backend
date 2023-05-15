import { Company } from "src/company/entities/company.entity";
import { Project } from "src/project/entities/project.entity";
import { Task } from "src/task/entities/task.entity";
import { Position, Role } from "src/types/user.type";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Index, ManyToMany, JoinTable, OneToMany, ManyToOne } from "typeorm";

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

    @Column({
        type: 'varchar',
        length: 60,
        default: null,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 60,
        default: null,
    })
    password: string;

    @Column({
        length: 36,
        nullable: true,
        default: null,
    })
    @Index({ unique: true })
    public userToken: string;
    
    @Column({
        type: 'datetime',
        nullable: true,
        default: null,
    })
    public userTokenExpiredAt: Date;
    
    @Column()
    public jwtId: string;

    @Column({
        type: 'bool',
        default: false,
      })
      isActive: boolean;
      
      @Column({
        type: 'varchar',
        length: 255,
        default: null,
      })
      link: string | null;
      @Column({
        default: () => 'CURRENT_TIMESTAMP',
      })
      createdAt: Date;
      
      @Column({
        type: 'enum',
        enum: Role,
      })
      role: Role;
      
      // @Column({
      //   type: 'varchar',
      // })
      @ManyToMany(() => Project, (project) => project.users )
      @JoinTable()
      projects: Project[];
  
      @OneToMany(() => Task, (task) => task.id)
      tasks: Task[];
  
      @Column({
        type: 'enum',
        enum: Position
      })
      position: Position;
  
      @Column({
        type: 'varchar',
        length: 50,
      })
      department: string;
  
      @Column({
        type: 'boolean',
        default: false,
      })
      loggedIn: boolean;

      @ManyToOne(() => Company, (company => company.name))
      company: Company;

      static async findUsersByCompany(companyId: string) {

        const results = await this.createQueryBuilder('users')
            .leftJoinAndSelect('users.company', 'company')
            .getMany();

        const usersWithCompany = results.filter(users => users.company);
        const searchedUsers = usersWithCompany.map(users => {
            if(users.company.id === companyId){
              return users;
            }
        }).filter(item => item);
                
        return searchedUsers;
    }

    static async extendUserCompany(userId){
      const results = await this.createQueryBuilder('users')
            .leftJoinAndSelect('users.company', 'company')
            .getOne();

            console.log('szukany rezultat', results);
            return results;
    }
}