import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

export enum Role {
  Dev = 'Dev',
  Tester = 'Tester',
  BA = 'BA',
}

@Schema({ timestamps: true })
export class Participant {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  // Checkbox -> allow multiple roles
  @Prop({ type: [String], enum: Role, default: [] })
  roles: Role[];
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
