import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { TimeStamp } from "src/common/metadata";

@Schema({ timestamps: true })
export class Token extends TimeStamp {
    @Prop()
    hashRt: string;
    @Prop()
    expriseAt: Date;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true })
    createdBy: mongoose.Schema.Types.ObjectId | string;

}
export type TokenDocument = HydratedDocument<Token>;
export const TokenSchema = SchemaFactory.createForClass(Token);
