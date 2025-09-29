import { ApiProperty } from "@nestjs/swagger";
import { TimeStamp } from "src/common/metadata";
import { Profile } from "../../schema/profile";

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
    profile?: Profile | null
}