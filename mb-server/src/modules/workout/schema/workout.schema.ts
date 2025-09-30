import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { WorkOutLevel, WorkoutStatus } from "src/common/enums";
import { Metadata } from "src/common/metadata";
import { Exercise } from "src/modules/exercises/schema/exercises.schema";
import { User } from "src/modules/user/schema/user.schema";

@Schema({ timestamps: true })
export class WorkOut extends Metadata {
    @Prop({ type: String })
    name?: string; // đặt tên (default -> exersise name)

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Exercise.name })
    exersie: string | ObjectId; // tên bài tập ()

    @Prop({ type: Number })
    weight: number; // mức cân

    @Prop({ type: Number, default: 1 })
    reps: number; // số reps mỗi set

    @Prop({ type: Number, default: 1 })
    sets: number; // số set

    @Prop({ type: Number, default: 1 })
    break: number; // lượt nghỉ lần mỗi set

    @Prop({ type: Number, default: 0 })
    rest: number; // phút

    @Prop({ enum: WorkOutLevel, default: WorkOutLevel.BEGINNER })
    userLevel: string; // tính toán đó khó so với năng lực của user

    @Prop({ type: String, nullable: true, default: null })
    note?: string | null;

    @Prop({ enum: WorkoutStatus, default: WorkoutStatus.INPROGRESS })
    status: WorkoutStatus;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    declare createdBy: string | ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    declare updatedBy: string | ObjectId;
}

export type WorkOutDocument = HydratedDocument<WorkOut>
export const WorkOutSchema = SchemaFactory.createForClass(WorkOut);