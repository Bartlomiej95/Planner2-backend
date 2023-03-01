import { Position, Role } from "src/types/user.type";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

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
      
      @Column({
        type: 'string',
        array: true,
      })
      projects: string[];
  
      @Column({
        type: 'string',
        array: true
      })
      tasks: string[];
  
      @Column({
        type: 'enum',
        enum: Position
      })
      position: Position;
  
      @Column({
        type: 'string',
        length: 50,
      })
      department: string;
  
      @Column({
        type: 'boolean',
        default: false,
      })
      loggedIn: boolean;

      @Column({
        type: 'varchar',
        default: null,
      })
      comapny: string;
}