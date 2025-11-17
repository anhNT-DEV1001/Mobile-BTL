import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkOut, WorkOutSchema } from './schema/workout.schema';
import { Exercise, ExerciseSchema } from '../exercises/schema/exercises.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { WorkOutTemplate, WorkOutTemplateSchema } from './schema/workout-template';
import { UserExercise, UserExerciseSchema } from './schema/user-exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkOut.name, schema: WorkOutSchema },
      { name: UserExercise.name, schema: UserExerciseSchema },
      { name: Exercise.name, schema: ExerciseSchema },
      { name: User.name, schema: UserSchema },
      { name: WorkOutTemplate.name, schema: WorkOutTemplateSchema }
    ])
  ],
  providers: [WorkoutService],
  controllers: [WorkoutController],
  exports: [WorkoutService]
})
export class WorkoutModule { }
