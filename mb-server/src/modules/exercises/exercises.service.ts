import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise, ExerciseDocument } from './schema/exercises.schema';
import { Model } from 'mongoose';
import { ExerciseResponse } from './dto/res/exercise.response';
import { ExerciseQuery } from './dto/req/exercise.request';

@Injectable()
export class ExercisesService {
    constructor(@InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>) { }
    toExerciseResponse(exercise: ExerciseDocument) {
        return {
            _id: exercise._id.toString(),
            name: exercise.name,
            force: exercise.force,
            level: exercise.level,
            mechanic: exercise.mechanic,
            equipment: exercise.equipment,
            primaryMuscles: exercise.primaryMuscles,
            secondaryMuscles: exercise.secondaryMuscles,
            instructions: exercise.instructions,
            category: exercise.category,
            images: exercise.images,
            id: exercise.id,
        }
    }

    async findAll(query?: ExerciseQuery): Promise<{ items: ExerciseResponse[]; total: number; page: number; limit: number }> {
        const page = query && query.page ? Math.max(1, parseInt(query.page, 10)) : 1;
        const limit = query && query.limit ? Math.max(1, Math.min(100, parseInt(query.limit, 10))) : 10; // default 10, cap 100

        const filters: any = {};

        if (query) {
            if (query.q) {
                // partial match on name (case-insensitive)
                filters.name = { $regex: query.q, $options: 'i' };
            }
            if (query.force) filters.force = query.force;
            if (query.level) filters.level = query.level;
            if (query.mechanic) filters.mechanic = query.mechanic;
            if (query.equipment) filters.equipment = query.equipment;
            if (query.primaryMuscles) filters.primaryMuscles = query.primaryMuscles;
            if (query.category) filters.category = query.category;
        }

        // default sort by name ascending
        let sort: any = { name: 1 };
        if (query && query.sort) {
            // accept 'field:asc' or 'field:desc'
            const parts = query.sort.split(':');
            if (parts.length === 2) {
                sort = { [parts[0]]: parts[1].toLowerCase() === 'desc' ? -1 : 1 };
            } else {
                sort = { [query.sort]: 1 };
            }
        }

        const skip = (page - 1) * limit;

        const [itemsDocs, total] = await Promise.all([
            this.exerciseModel.find(filters).sort(sort).skip(skip).limit(limit).exec(),
            this.exerciseModel.countDocuments(filters).exec(),
        ]);

        const items = itemsDocs.map(ex => this.toExerciseResponse(ex));
        return { items, total, page, limit };
    }







}
