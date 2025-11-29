import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Metadata } from "src/common/metadata";
import { User } from "src/modules/user/schema/user.schema";
import { WorkOutTemplate } from "src/modules/workout/schema/workout-template";

@Schema({timestamps : true})
export class Schedule extends Metadata {
  @Prop({type : String })
  name : string;
  @Prop({type : String})
  type : string;
  @Prop({type : Number , default : 1})
  replay : number;
  @Prop({type : [mongoose.Schema.Types.ObjectId] , ref : WorkOutTemplate.name})
  template: string[] | ObjectId[];
  @Prop({type : mongoose.Schema.Types.ObjectId , ref : User.name })
  declare createdBy: string | mongoose.Schema.Types.ObjectId;
  @Prop({type : mongoose.Schema.Types.ObjectId , ref : User.name })
  declare updatedBy: string | mongoose.Schema.Types.ObjectId; 
}

export type ScheduleDocument = HydratedDocument<Schedule>;
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);