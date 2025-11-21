import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Metadata } from "src/common/metadata";
import { Exercise } from "src/modules/exercises/schema/exercises.schema";
import { User } from "src/modules/user/schema/user.schema";
import { WorkOut } from "./workout.schema";

// Sub-schema cho mỗi set trong bài tập
@Schema({ _id: false })
export class ExerciseSet {
  @Prop({ type: Number, required: true })
  reps: number; // Số lần lặp

  @Prop({ type: Number, default: 0 })
  weight?: number; // Trọng lượng tạ (kg) - dành cho bài tập có equipment

  @Prop({ type: String, default: null })
  level?: string | null; // Strength level được tính cho set này (beginner, novice, intermediate, advanced)
}

export const ExerciseSetSchema = SchemaFactory.createForClass(ExerciseSet);

@Schema({ timestamps: true })
export class UserExercise extends Metadata {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Exercise.name, required: true })
  exercise: string | ObjectId; // Bài tập được thực hiện

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: WorkOut.name, required: true })
  workout: string | ObjectId; // Buổi tập chứa bài tập này

  @Prop({ type: [ExerciseSetSchema], default: [] })
  sets: ExerciseSet[]; // Danh sách các set đã thực hiện

  @Prop({ type: Number, default: 0 })
  totalVolume?: number; // Tổng volume (sum of sets * reps * weight)

  @Prop({ type: String })
  note?: string; // Ghi chú của người dùng

  @Prop({type: Boolean , default: false})
  isDone?: boolean;

  @Prop({type : String , default: ""})
  timer?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  declare createdBy: string | ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  declare updatedBy: string | ObjectId;
}

export type UserExerciseDocument = HydratedDocument<UserExercise>;
export const UserExerciseSchema = SchemaFactory.createForClass(UserExercise);
