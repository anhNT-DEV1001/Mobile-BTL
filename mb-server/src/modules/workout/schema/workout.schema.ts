import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Metadata } from "src/common/metadata";
import { User } from "src/modules/user/schema/user.schema";

@Schema({ timestamps: true })
export class WorkOut extends Metadata {
    @Prop({ type: String, default: 'New Workout' })
    name: string; // Tên buổi tập, mặc định là "New Workout"

    @Prop({ type: Date, required: true })
    date: Date; // Ngày tập (người dùng có thể thêm workout cho ngày trước đó)

    @Prop({ type: String })
    note?: string; // Ghi chú cho buổi tập

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    declare createdBy: string | ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    declare updatedBy: string | ObjectId;
}

export type WorkOutDocument = HydratedDocument<WorkOut>
export const WorkOutSchema = SchemaFactory.createForClass(WorkOut);