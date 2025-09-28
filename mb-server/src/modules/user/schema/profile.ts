import { ApiProperty } from "@nestjs/swagger";

export class Profile {
    @ApiProperty()
    avatar?: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    dob: Date;
    @ApiProperty()
    height: number;
    @ApiProperty()
    weight: number;
}