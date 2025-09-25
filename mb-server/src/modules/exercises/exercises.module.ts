import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from './schema/exercises.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name : Exercise.name, schema: ExerciseSchema}])
  ],
  providers: [ExercisesService],
  controllers: [ExercisesController],
  exports:[ExercisesService]
})
export class ExercisesModule {}
