import { CompanyModule } from 'src/company/company.module';
import { Company } from 'src/company/entities/company.entity';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '../../../config/config';

export const connectionSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  entities: [
    'dist/**/**/**.entity{.ts,.js}',
    'dist/**/**.entity{.ts,.js}',
    'dist/**.entity{.ts,.js}',
    User,
    Project,
    Task,
    Company,
  ],
  bigNumberStrings: false,
  logging: config.logging,
  migrations: ['dist/database/migrations/*.js'],
  synchronize: config.synchronize,
  autoLoadEntities: true,
  extra: {
    decimalNumbers: true,
  },
  cli: {
    migrationsDir: 'migrations',
  },
} as DataSourceOptions);
