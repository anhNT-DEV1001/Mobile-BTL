import { Schema } from "mongoose";
import { Metadata } from "src/common/metadata";

export class ScheduleResponse extends Metadata{
  id : string;
  name : string;
  type : string;
  replay : number;
  templates : any;
  declare createdAt?: Date | undefined;
  declare updatedAt?: Date | undefined;
  declare createdBy: string | Schema.Types.ObjectId;
  declare updatedBy: string | Schema.Types.ObjectId;
}

export class Template {

}