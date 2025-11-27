import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";

export class ScheduleDto {
  @ApiProperty()
  @IsNotEmpty({message : 'Vui long nhap ten lich'})
  name: string;
  @ApiProperty()
  @IsOptional()
  type: string;
  @ApiProperty()
  @IsOptional()
  replay : number;
  @ApiProperty()
  @IsNotEmpty({message: 'Vui long chon template'})
  templates : string[] | ObjectId[];
}
