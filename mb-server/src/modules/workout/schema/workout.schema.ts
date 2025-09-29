import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { WorkoutStatus } from "src/common/enums";
import { Metadata } from "src/common/metadata";
import { Exercise } from "src/modules/exercises/schema/exercises.schema";
import { User } from "src/modules/user/schema/user.schema";

@Schema({ timestamps: true })
export class WorkOut extends Metadata {
    @Prop()
    name: string; // đặt tên (default -> exersise name)

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Exercise.name })
    exersie: string | ObjectId; // tên bài tập ()

    @Prop()
    weight: number; // mức cân

    @Prop()
    reps: number; // số reps mỗi set

    @Prop()
    sets: number; // số set

    @Prop()
    break: number; // lượt nghỉ lần mỗi set

    @Prop()
    rest: number; // phút

    @Prop()
    userLevel: string; // tính toán đó khó so với năng lực của user

    @Prop()
    note: string;

    @Prop({ enum: WorkoutStatus, default: WorkoutStatus.INPROGRESS })
    status: WorkoutStatus;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    declare createdBy: string | ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    declare updatedBy: string | ObjectId;
}

export type WorkOutDocument = HydratedDocument<WorkOut>
export const WorkOutSchema = SchemaFactory.createForClass(WorkOut);