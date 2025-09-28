import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRole, UserStatus } from "src/common/enums";
import { TimeStamp } from "src/common/metadata";
import { Profile } from "./profile";

@Schema({ timestamps: true })
export class User extends TimeStamp {
    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop({ enum: UserRole, default: UserRole.USER })
    role: string;

    @Prop({ default: false })
    isActive: boolean

    @Prop({ enum: UserStatus, default: UserStatus.INACTIVE })
    status: string;

    @Prop({ nullable: true })
    profile: Profile
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);