import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkOut, WorkOutSchema } from './schema/workout.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: WorkOut.name, schema: WorkOutSchema }])],
  providers: [WorkoutService],
  controllers: [WorkoutController]
})
export class WorkoutModule { }
