import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Metadata } from "src/common/metadata";
import { User } from "src/modules/user/schema/user.schema";
import { Exercise } from "src/modules/exercises/schema/exercises.schema";

@Schema({ timestamps: true })
export class WorkOutTemplate extends Metadata {
  @Prop({ type: String, required: true })
  name: string; // Tên template

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Exercise.name })
  exercises: Exercise[]; // Danh sách các bài tập trong template

  @Prop({ type: String, nullable: true, default: null })
  level?: string | null; // Mức độ của template (beginner, intermediate, advanced)

  @Prop({ type: String })
  type?: string | null; // Loại template (strength, cardio, full-body, etc.)
  
  @Prop({ type: String, nullable: true, default: null })
  note?: string | null; // Ghi chú về template

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  declare createdBy: string | ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  declare updatedBy: string | ObjectId;
}

export type WorkOutTemplateDocument = HydratedDocument<WorkOutTemplate>
export const WorkOutTemplateSchema = SchemaFactory.createForClass(WorkOutTemplate);