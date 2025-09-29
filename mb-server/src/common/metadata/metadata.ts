import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";

export class TimeStamp {
    @ApiProperty()
    createdAt?: Date;
    @ApiProperty()
    updatedAt?: Date
}

export class Metadata extends TimeStamp {
    @ApiProperty()
    createdBy: string | ObjectId;
    @ApiProperty()
    updatedBy: string | ObjectId;
}
