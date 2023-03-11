import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/providers/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, ProjectModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
