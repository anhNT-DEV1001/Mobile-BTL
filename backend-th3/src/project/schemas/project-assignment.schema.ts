import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectAssignmentDocument = ProjectAssignment & Document;

@Schema({ timestamps: true })
export class ProjectAssignment {
  @Prop({ type: Types.ObjectId, ref: 'Participant', required: true })
  participant: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Date, required: true })
  joinedAt: Date;
}

export const ProjectAssignmentSchema = SchemaFactory.createForClass(ProjectAssignment);
