import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsString, IsNotEmpty, IsEnum, IsArray, ArrayNotEmpty, ArrayUnique, IsUrl } from 'class-validator';
import { ExerciseForce, ExerciseLevel, ExerciseCategory, ExerciseEquipment, ExerciseMechanic } from 'src/common/enums/exercise.enum';

export class ExerciseQuery {
    @ApiPropertyOptional({ description: 'Page number (1-based)', example: 1 })
    @IsOptional()
    @IsNumberString()
    page?: string;

    @ApiPropertyOptional({ description: 'Items per page', example: 10 })
    @IsOptional()
    @IsNumberString()
    limit?: string;

    @ApiPropertyOptional({ description: 'Sort string, e.g. createdAt:desc or name:asc' })
    @IsOptional()
    @IsString()
    sort?: string;

    @ApiPropertyOptional({ description: 'Search by name (partial match)' })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({ description: 'Filter by exact force value' })
    @IsOptional()
    @IsString()
    force?: string;

    @ApiPropertyOptional({ description: 'Filter by level' })
    @IsOptional()
    @IsString()
    level?: string;

    @ApiPropertyOptional({ description: 'Filter by mechanic' })
    @IsOptional()
    @IsString()
    mechanic?: string;

    @ApiPropertyOptional({ description: 'Filter by equipment' })
    @IsOptional()
    @IsString()
    equipment?: string;

    @ApiPropertyOptional({ description: 'Filter by primary muscle (single value)' })
    @IsOptional()
    @IsString()
    primaryMuscles?: string;

    @ApiPropertyOptional({ description: 'Filter by category' })
    @IsOptional()
    @IsString()
    category?: string;
}

export class CreateExerciseDto {
    @ApiPropertyOptional({ description: 'Exercise name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: 'Primary key id (from source)', example: 'Ab_Roller' })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiPropertyOptional({ description: "Force type", example: ExerciseForce.PUSH })
    @IsOptional()
    @IsEnum(ExerciseForce)
    force?: ExerciseForce;

    @ApiPropertyOptional({ description: 'Difficulty level', example: ExerciseLevel.BEGINNER })
    @IsOptional()
    @IsEnum(ExerciseLevel)
    level?: ExerciseLevel;

    @ApiPropertyOptional({ description: 'Mechanic type' })
    @IsOptional()
    @IsEnum(ExerciseMechanic)
    mechanic?: ExerciseMechanic;

    @ApiPropertyOptional({ description: 'Equipment used' })
    @IsOptional()
    @IsEnum(ExerciseEquipment)
    equipment?: ExerciseEquipment;

    @ApiPropertyOptional({ type: [String], description: 'Primary muscles worked' })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    primaryMuscles: string[];

    @ApiPropertyOptional({ type: [String], description: 'Secondary muscles (optional)' })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    secondaryMuscles?: string[];

    @ApiPropertyOptional({ type: [String], description: 'Step by step instructions' })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    instructions: string[];

    @ApiPropertyOptional({ description: 'Category (e.g. strength, stretching, plyometrics)' })
    @IsOptional()
    @IsEnum(ExerciseCategory)
    category?: ExerciseCategory;

    @ApiPropertyOptional({ type: [String], description: 'Image paths relative to assets' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({ description: 'Animated gif url' })
    @IsOptional()
    @IsUrl()
    gif?: string;
}

export class UpdateExerciseDto {
    @ApiPropertyOptional({ description: 'Exercise name' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiPropertyOptional({ description: 'Primary key id (from source)', example: 'Ab_Roller' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    id?: string;

    @ApiPropertyOptional({ description: "Force type", example: ExerciseForce.PUSH })
    @IsOptional()
    @IsEnum(ExerciseForce)
    force?: ExerciseForce;

    @ApiPropertyOptional({ description: 'Difficulty level', example: ExerciseLevel.BEGINNER })
    @IsOptional()
    @IsEnum(ExerciseLevel)
    level?: ExerciseLevel;

    @ApiPropertyOptional({ description: 'Mechanic type' })
    @IsOptional()
    @IsEnum(ExerciseMechanic)
    mechanic?: ExerciseMechanic;

    @ApiPropertyOptional({ description: 'Equipment used' })
    @IsOptional()
    @IsEnum(ExerciseEquipment)
    equipment?: ExerciseEquipment;

    @ApiPropertyOptional({ type: [String], description: 'Primary muscles worked' })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    primaryMuscles?: string[];

    @ApiPropertyOptional({ type: [String], description: 'Secondary muscles (optional)' })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    secondaryMuscles?: string[];

    @ApiPropertyOptional({ type: [String], description: 'Step by step instructions' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    instructions?: string[];

    @ApiPropertyOptional({ description: 'Category (e.g. strength, stretching, plyometrics)' })
    @IsOptional()
    @IsEnum(ExerciseCategory)
    category?: ExerciseCategory;

    @ApiPropertyOptional({ type: [String], description: 'Image paths relative to assets' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({ description: 'Animated gif url' })
    @IsOptional()
    @IsUrl()
    gif?: string;
}

