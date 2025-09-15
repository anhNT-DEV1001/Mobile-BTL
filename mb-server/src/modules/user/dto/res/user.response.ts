import { ApiProperty } from "@nestjs/swagger";
import { TimeStamp } from "src/common/metadata";

export class UserResponse extends TimeStamp {
    @ApiProperty()
    id: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    role: string;
    @ApiProperty()
    status: string;
    @ApiProperty()
    name?: string
    @ApiProperty()
    dob?: Date;
}