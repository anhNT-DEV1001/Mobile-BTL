import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';
import { Model } from 'mongoose';
import { ScheduleDto, ScheduleResponse } from './dto';
import { ApiError } from 'src/common/api';
import { UserResponse } from '../user/dto/res/user.response';


@Injectable()
export class ScheduleService {
  constructor(@InjectModel(Schedule.name) private scheduleModel : Model<ScheduleDocument> ) {}
  toScheduleResponse (scheduleDoc : ScheduleDocument) : ScheduleResponse {
    return {
      id : scheduleDoc._id.toString(),
      name : scheduleDoc.name,
      type : scheduleDoc.type,
      replay : scheduleDoc.replay,
      templates: scheduleDoc.template,
      createdAt: scheduleDoc.createdAt,
      updatedAt: scheduleDoc.updatedAt,
      createdBy: scheduleDoc.createdBy,
      updatedBy: scheduleDoc.updatedBy
    }
  }
  async createSchedule(user : UserResponse , dto : ScheduleDto) : Promise<ScheduleResponse>{
    const data = {
      name : dto.name,
      type:dto.type,
      replay: dto.replay,
      template: dto.templates,
      createdBy: user.id,
      updatedBy: user.id
    } as Schedule
    const newSchedule = await this.scheduleModel.create(data);
    if(!newSchedule) throw new ApiError('Faild to create schedule' , HttpStatus.BAD_REQUEST);
    return this.toScheduleResponse(newSchedule);
  }

  async getUserSchedule(user : UserResponse) : Promise<ScheduleResponse>{
    const schedule = await this.scheduleModel.findOne({ createdBy: user.id })
    .populate({
      path: 'template', 
      populate: {
        path: 'exercises',
        model: 'Exercise' 
      }
    })
    .exec();
    if(!schedule) throw new ApiError('Faild to get schedule', HttpStatus.BAD_REQUEST);
    
    return this.toScheduleResponse(schedule);
  }

  async updateUserSchedule(user: UserResponse , dto : ScheduleDto) : Promise<ScheduleResponse>{
    console.log("dto---",dto);
    const data = {
      name : dto.name,
      type:dto.type,
      replay: dto.replay,
      template: dto.templates,
      updatedBy: user.id
    }
    const updated = await this.scheduleModel.findOneAndUpdate({createdBy: user.id} , data, { new: true });
    if(!updated) throw new ApiError('Faild to updated' , HttpStatus.BAD_REQUEST);
    return this.toScheduleResponse(updated);
  }

  async deleteUserSchedule(user: UserResponse): Promise<ScheduleResponse> {
    const schedule = await this.scheduleModel.findOneAndDelete({
      createdBy: user.id
    });

    if (!schedule) {
      throw new ApiError('Failed to delete!', HttpStatus.BAD_REQUEST);
    }
    return this.toScheduleResponse(schedule);
  }
  
}
