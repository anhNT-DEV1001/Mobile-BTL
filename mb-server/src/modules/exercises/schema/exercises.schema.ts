import { HydratedDocument } from 'mongoose';
import { ExerciseCategory, ExerciseEquipment, ExerciseForce, ExerciseLevel, ExerciseMechanic } from './../../../common/enums/exercise.enum';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Exercise {
    @Prop()
    name: string;

    @Prop({ enum: ExerciseForce })
    force: string;

    @Prop({ enum: ExerciseLevel })
    level: string;

    @Prop({ enum: ExerciseMechanic })
    mechanic: string;

    @Prop({ enum: ExerciseEquipment })
    equipment: string;

    @Prop()
    primaryMuscles: string[];

    @Prop()
    secondaryMuscles: string[];

    @Prop()
    instructions: string[];

    @Prop({ enum: ExerciseCategory })
    category: string;

    @Prop()
    images: string[];

    @Prop({ unique: true })
    id: string;
}

export type ExerciseDocument = HydratedDocument<Exercise>;
export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

