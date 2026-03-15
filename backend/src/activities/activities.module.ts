// Caminho: src/activities/activities.module.ts

import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { AuthModule } from 'src/auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    AuthModule
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService]
})
export class ActivitiesModule {}