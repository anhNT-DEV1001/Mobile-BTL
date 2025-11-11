import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WorkOut, WorkOutDocument } from './schema/workout.schema';
import { Model } from 'mongoose';
import { UserResponse } from '../user/dto/res/user.response';
import { calculateSetStrengthLevel } from 'src/common/utils';
import { ApiError } from 'src/common/api';
import { Exercise, ExerciseDocument } from '../exercises/schema/exercises.schema';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto/req/workout.request';
import { UserExerciseResponse, WorkoutResponse, WorkoutTemplateResponse } from './dto/res/workout.response';
import { User, UserDocument } from '../user/schema/user.schema';
import { WorkOutTemplate, WorkOutTemplateDocument } from './schema/workout-template';
import { UserExercise, UserExerciseDocument } from './schema/user-exercise.schema';
import { CreateUserExerciseDto, UpdateUserExerciseDto } from './dto/req/user-exercise.request';
import { CreateWorkoutTemplateDto, UpdateWorkoutTemplateDto } from './dto/req/workout-template.request';

@Injectable()
export class WorkoutService {
    constructor(
        @InjectModel(WorkOut.name) private workoutModel: Model<WorkOutDocument>,
        @InjectModel(UserExercise.name) private userExerciseModel: Model<UserExerciseDocument>,
        @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(WorkOutTemplate.name) private workoutTemplateModel: Model<WorkOutTemplateDocument>
    ) { }

    // ==================== WORKOUT METHODS ====================
    
    toWorkoutResponse(workout: WorkOutDocument): WorkoutResponse {
        return {
            id: workout._id.toString(),
            name: workout.name,
            date: workout.date,
            note: workout.note,
            createdAt: workout.createdAt,
            createdBy: workout.createdBy,
            updatedAt: workout.updatedAt,
            updatedBy: workout.updatedBy
        }
    }

    async createWorkout(workoutDto: CreateWorkoutDto, user: UserResponse): Promise<WorkoutResponse> {
        const data: WorkOut = {
            name: workoutDto.name || 'New Workout',
            date: workoutDto.date,
            note: workoutDto.note,
            createdBy: user.id,
            updatedBy: user.id,
        }
        const newWorkout = await this.workoutModel.create(data);
        if (!newWorkout) throw new ApiError("Tạo buổi tập thất bại!", HttpStatus.BAD_REQUEST);
        return this.toWorkoutResponse(newWorkout);
    }

    async getWorkoutsByUser(user: UserResponse): Promise<WorkoutResponse[]> {
        const workouts = await this.workoutModel.find({ createdBy: user.id }).sort({ date: -1 });
        return workouts.map(workout => this.toWorkoutResponse(workout));
    }

    async getWorkoutById(workoutId: string, user: UserResponse): Promise<WorkoutResponse> {
        const workout = await this.workoutModel.findOne({ _id: workoutId, createdBy: user.id });
        if (!workout) throw new ApiError("Buổi tập không tồn tại!", HttpStatus.NOT_FOUND);
        return this.toWorkoutResponse(workout);
    }

    async updateWorkout(workoutId: string, workoutDto: UpdateWorkoutDto, user: UserResponse): Promise<WorkoutResponse> {
        const workout = await this.workoutModel.findOneAndUpdate(
            { _id: workoutId, createdBy: user.id },
            { ...workoutDto, updatedBy: user.id },
            { new: true }
        );
        if (!workout) throw new ApiError('Buổi tập không tồn tại!', HttpStatus.NOT_FOUND);
        return this.toWorkoutResponse(workout);
    }

    async deleteWorkout(workoutId: string, user: UserResponse): Promise<WorkoutResponse> {
        // Xóa tất cả user exercises thuộc workout này
        await this.userExerciseModel.deleteMany({ workout: workoutId, createdBy: user.id });
        
        const workout = await this.workoutModel.findOneAndDelete({ _id: workoutId, createdBy: user.id });
        if (!workout) throw new ApiError("Buổi tập không tồn tại!", HttpStatus.NOT_FOUND);
        return this.toWorkoutResponse(workout);
    }

    // ==================== USER EXERCISE METHODS ====================

    toUserExerciseResponse(userExercise: UserExerciseDocument): UserExerciseResponse {
        return {
            id: userExercise._id.toString(),
            exercise: userExercise.exercise,
            workout: userExercise.workout.toString(),
            sets: userExercise.sets,
            totalVolume: userExercise.totalVolume,
            note: userExercise.note,
            createdAt: userExercise.createdAt,
            createdBy: userExercise.createdBy,
            updatedAt: userExercise.updatedAt,
            updatedBy: userExercise.updatedBy
        }
    }

    async createUserExercise(dto: CreateUserExerciseDto, user: UserResponse): Promise<UserExerciseResponse> {
        // Kiểm tra exercise có tồn tại
        const exercise = await this.exerciseModel.findById(dto.exercise);
        if (!exercise) throw new ApiError("Bài tập không tồn tại!", HttpStatus.BAD_REQUEST);

        // Kiểm tra workout có tồn tại và thuộc về user
        const workout = await this.workoutModel.findOne({ _id: dto.workout, createdBy: user.id });
        if (!workout) throw new ApiError("Buổi tập không tồn tại!", HttpStatus.BAD_REQUEST);

        // Lấy thông tin user để tính level
        const userDoc = await this.userModel.findById(user.id);
        if (!userDoc || !userDoc.profile) {
            throw new ApiError("Vui lòng cập nhật thông tin cá nhân trước!", HttpStatus.BAD_REQUEST);
        }

        // Tính level cho từng set (chỉ với bài tập có trọng lượng)
        const setsWithLevel = dto.sets.map(set => {
            let level: string | null = null;
            
            // Chỉ tính level nếu bài tập sử dụng equipment và có weight
            const needsWeight = ['barbell', 'cable', 'machine', 'kettlebell', 'dumbbell'].includes(exercise.equipment.toLowerCase());
            
            if (needsWeight && set.weight && set.weight > 0) {
                level = calculateSetStrengthLevel(
                    { weight: set.weight, reps: set.reps },
                    {
                        weight: userDoc.profile.weight,
                        height: userDoc.profile.height,
                        dob: userDoc.profile.dob,
                        gender: userDoc.profile.gender
                    }
                );
            }

            return {
                reps: set.reps,
                weight: set.weight || 0,
                level
            };
        });

        // Tính tổng volume
        const totalVolume = setsWithLevel.reduce((sum, set) => {
            return sum + (set.reps * (set.weight || 0));
        }, 0);

        const data: UserExercise = {
            exercise: dto.exercise,
            workout: dto.workout,
            sets: setsWithLevel,
            totalVolume,
            note: dto.note,
            createdBy: user.id,
            updatedBy: user.id
        }

        const newUserExercise = await this.userExerciseModel.create(data);
        const populated = await newUserExercise.populate('exercise');
        return this.toUserExerciseResponse(populated);
    }

    async getUserExercisesByWorkout(workoutId: string, user: UserResponse): Promise<UserExerciseResponse[]> {
        const userExercises = await this.userExerciseModel
            .find({ workout: workoutId, createdBy: user.id })
            .populate('exercise')
            .sort({ createdAt: 1 });
        
        return userExercises.map(ue => this.toUserExerciseResponse(ue));
    }

    async updateUserExercise(
        userExerciseId: string, 
        dto: UpdateUserExerciseDto, 
        user: UserResponse
    ): Promise<UserExerciseResponse> {
        const userExercise = await this.userExerciseModel.findOne({ 
            _id: userExerciseId, 
            createdBy: user.id 
        });
        
        if (!userExercise) throw new ApiError("Bài tập không tồn tại!", HttpStatus.NOT_FOUND);

        // Nếu cập nhật exercise
        if (dto.exercise) {
            const exercise = await this.exerciseModel.findById(dto.exercise);
            if (!exercise) throw new ApiError("Bài tập không tồn tại!", HttpStatus.BAD_REQUEST);
            userExercise.exercise = dto.exercise;
        }

        // Nếu cập nhật sets, tính lại level
        if (dto.sets) {
            const userDoc = await this.userModel.findById(user.id);
            const exercise = await this.exerciseModel.findById(userExercise.exercise);
            
            if (!exercise) {
                throw new ApiError("Bài tập không tồn tại!", HttpStatus.BAD_REQUEST);
            }
            
            const setsWithLevel = dto.sets.map(set => {
                let level: string | null = null;
                const needsWeight = ['barbell', 'cable', 'machine', 'kettlebell', 'dumbbell'].includes(
                    exercise.equipment.toLowerCase()
                );
                
                if (needsWeight && set.weight && set.weight > 0 && userDoc?.profile) {
                    level = calculateSetStrengthLevel(
                        { weight: set.weight, reps: set.reps },
                        {
                            weight: userDoc.profile.weight,
                            height: userDoc.profile.height,
                            dob: userDoc.profile.dob,
                            gender: userDoc.profile.gender
                        }
                    );
                }

                return { reps: set.reps, weight: set.weight || 0, level };
            });

            userExercise.sets = setsWithLevel;
            userExercise.totalVolume = setsWithLevel.reduce((sum, set) => {
                return sum + (set.reps * (set.weight || 0));
            }, 0);
        }

        if (dto.note !== undefined) userExercise.note = dto.note;
        userExercise.updatedBy = user.id;

        await userExercise.save();
        const populated = await userExercise.populate('exercise');
        return this.toUserExerciseResponse(populated);
    }

    async deleteUserExercise(userExerciseId: string, user: UserResponse): Promise<UserExerciseResponse> {
        const userExercise = await this.userExerciseModel
            .findOneAndDelete({ _id: userExerciseId, createdBy: user.id })
            .populate('exercise');
        
        if (!userExercise) throw new ApiError("Bài tập không tồn tại!", HttpStatus.NOT_FOUND);
        return this.toUserExerciseResponse(userExercise);
    }

    // ==================== WORKOUT TEMPLATE METHODS ====================

    toWorkoutTemplateResponse(template: WorkOutTemplateDocument): WorkoutTemplateResponse {
        return {
            id: template._id.toString(),
            name: template.name,
            exercises: template.exercises,
            level: template.level,
            type: template.type,
            note: template.note,
            createdAt: template.createdAt,
            createdBy: template.createdBy,
            updatedAt: template.updatedAt,
            updatedBy: template.updatedBy
        }
    }

    async createWorkoutTemplate(dto: CreateWorkoutTemplateDto, user: UserResponse): Promise<WorkoutTemplateResponse> {
        // Kiểm tra exercises có tồn tại
        const exercises = await this.exerciseModel.find({ _id: { $in: dto.exercises } });
        if (exercises.length !== dto.exercises.length) {
            throw new ApiError("Một số bài tập không tồn tại!", HttpStatus.BAD_REQUEST);
        }

        const data: WorkOutTemplate = {
            name: dto.name,
            exercises: dto.exercises as any,
            level: dto.level,
            type: dto.type,
            note: dto.note,
            createdBy: user.id,
            updatedBy: user.id
        }

        const newTemplate = await this.workoutTemplateModel.create(data);
        const populated = await newTemplate.populate('exercises');
        return this.toWorkoutTemplateResponse(populated);
    }

    async getWorkoutTemplates(user: UserResponse): Promise<WorkoutTemplateResponse[]> {
        // Lấy templates của user và templates mặc định (type: 'default')
        const templates = await this.workoutTemplateModel
            .find({
                $or: [
                    { createdBy: user.id },
                    { type: 'default' }
                ]
            })
            .populate('exercises')
            .sort({ createdAt: -1 });
        
        return templates.map(template => this.toWorkoutTemplateResponse(template));
    }

    async getWorkoutTemplateById(templateId: string, user: UserResponse): Promise<WorkoutTemplateResponse> {
        const template = await this.workoutTemplateModel
            .findOne({
                _id: templateId,
                $or: [
                    { createdBy: user.id },
                    { type: 'default' }
                ]
            })
            .populate('exercises');
        
        if (!template) throw new ApiError("Template không tồn tại!", HttpStatus.NOT_FOUND);
        return this.toWorkoutTemplateResponse(template);
    }

    async updateWorkoutTemplate(
        templateId: string, 
        dto: UpdateWorkoutTemplateDto, 
        user: UserResponse
    ): Promise<WorkoutTemplateResponse> {
        // Chỉ cho phép cập nhật template của chính user
        const template = await this.workoutTemplateModel.findOne({ 
            _id: templateId, 
            createdBy: user.id 
        });
        
        if (!template) throw new ApiError("Template không tồn tại hoặc không có quyền chỉnh sửa!", HttpStatus.NOT_FOUND);

        if (dto.exercises) {
            const exercises = await this.exerciseModel.find({ _id: { $in: dto.exercises } });
            if (exercises.length !== dto.exercises.length) {
                throw new ApiError("Một số bài tập không tồn tại!", HttpStatus.BAD_REQUEST);
            }
        }

        const updated = await this.workoutTemplateModel
            .findByIdAndUpdate(
                templateId,
                { ...dto, updatedBy: user.id },
                { new: true }
            )
            .populate('exercises');
        
        if (!updated) throw new ApiError("Cập nhật template thất bại!", HttpStatus.INTERNAL_SERVER_ERROR);
        return this.toWorkoutTemplateResponse(updated);
    }

    async deleteWorkoutTemplate(templateId: string, user: UserResponse): Promise<WorkoutTemplateResponse> {
        const template = await this.workoutTemplateModel
            .findOneAndDelete({ _id: templateId, createdBy: user.id })
            .populate('exercises');
        
        if (!template) throw new ApiError("Template không tồn tại hoặc không có quyền xóa!", HttpStatus.NOT_FOUND);
        return this.toWorkoutTemplateResponse(template);
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Tạo workout từ template
     */
    async createWorkoutFromTemplate(
        templateId: string, 
        date: Date, 
        user: UserResponse
    ): Promise<{ workout: WorkoutResponse; exercises: UserExerciseResponse[] }> {
        // Lấy template
        const template = await this.getWorkoutTemplateById(templateId, user);
        
        // Tạo workout mới
        const workout = await this.createWorkout(
            { name: template.name, date, note: `Từ template: ${template.name}` },
            user
        );

        // Tạo user exercises cho mỗi exercise trong template
        const userExercises: UserExerciseResponse[] = [];
        
        for (const exercise of template.exercises) {
            const exerciseId = typeof exercise === 'string' ? exercise : exercise._id?.toString();
            
            // Tạo mặc định 3 sets với reps = 10
            const defaultSets = [
                { reps: 10, weight: 0 },
                { reps: 10, weight: 0 },
                { reps: 10, weight: 0 }
            ];

            const userExercise = await this.createUserExercise(
                {
                    exercise: exerciseId,
                    workout: workout.id,
                    sets: defaultSets,
                    note: ''
                },
                user
            );

            userExercises.push(userExercise);
        }

        return { workout, exercises: userExercises };
    }
}
