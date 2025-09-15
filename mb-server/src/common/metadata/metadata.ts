import { ApiProperty } from "@nestjs/swagger";

export class TimeStamp {
    @ApiProperty()
    createdAt?: Date;
    @ApiProperty()
    updatedAt?: Date
}