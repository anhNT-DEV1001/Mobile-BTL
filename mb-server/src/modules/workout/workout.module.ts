import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkOut, WorkOutSchema } from './schema/workout.schema';
import { Exercise, ExerciseSchema } from '../exercises/schema/exercises.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkOut.name, schema: WorkOutSchema },
      { name: Exercise.name, schema: ExerciseSchema }
    ])],
  providers: [WorkoutService],
  controllers: [WorkoutController]
})
export class WorkoutModule { }
