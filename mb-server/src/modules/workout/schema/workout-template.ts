import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Metadata } from "src/common/metadata";
import { User } from "src/modules/user/schema/user.schema";
import { WorkOut } from "./workout.schema";

@Schema({ timestamps: true })
export class WorkOutTemplate extends Metadata {
  @Prop({ type: String })
  name?: string; 

  @Prop({type: [mongoose.Schema.Types.ObjectId], ref: WorkOut.name })
  workouts : WorkOut[];

  @Prop({type: String , nullable: true , default:null})
  level? : string | null;

  @Prop({type: String })
  type? : string | null;
  
  @Prop({ type: String, nullable: true, default: null })
  note?: string | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  declare createdBy: string | ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  declare updatedBy: string | ObjectId;
}

export type WorkOutTemplateDocument = HydratedDocument<WorkOutTemplate>
export const WorkOutTemplateSchema = SchemaFactory.createForClass(WorkOutTemplate);