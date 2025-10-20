import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { DatabaseModule } from '../database/database.module';
import { Participant, ParticipantSchema } from './schemas/participant.schema';
import { ProjectAssignment, ProjectAssignmentSchema } from './schemas/project-assignment.schema';

@Module({
  imports:[
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Participant.name, schema: ParticipantSchema },
      { name: ProjectAssignment.name, schema: ProjectAssignmentSchema },
    ]),
  ],
  providers: [ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule {}
