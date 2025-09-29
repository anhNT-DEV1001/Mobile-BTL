import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "src/common/enums";

export class Profile {
    @ApiProperty()
    avatar?: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    gender: UserGender
    @ApiProperty()
    dob: Date;
    @ApiProperty()
    height: number;
    @ApiProperty()
    weight: number;
}