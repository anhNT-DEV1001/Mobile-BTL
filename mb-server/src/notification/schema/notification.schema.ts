import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Metadata } from "src/common/metadata";
import { Schedule } from "src/modules/schedule/schema/schedule.schema";
import { User } from "src/modules/user/schema/user.schema";

@Schema({timestamps : true})
export class Notifcation extends Metadata{
  @Prop({type : String})
  expoToken : string;
  @Prop({type: Number , default: 5})
  delay: number;
  @Prop({type : mongoose.Schema.Types.ObjectId , ref : Schedule.name})
  schedule: string | mongoose.Schema.Types.ObjectId;
  @Prop({type : [Number] , default: [1,2,3,4,5,6,0]}) //(0=Sunday) 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday, 0 = Sunday
  days: number[];
  @Prop({type : String, default: '00:00'}) // HH:MM
  time: string;
  @Prop({type : mongoose.Schema.Types.ObjectId , ref : User.name })
  declare createdBy: string | mongoose.Schema.Types.ObjectId;
  @Prop({type : mongoose.Schema.Types.ObjectId , ref : User.name})
  declare updatedBy: string | mongoose.Schema.Types.ObjectId;
}

export type NotificationDocument = HydratedDocument<Notifcation>
export const NotificationSchema = SchemaFactory.createForClass(Notifcation);