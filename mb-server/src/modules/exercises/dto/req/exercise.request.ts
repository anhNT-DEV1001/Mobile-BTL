import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsString } from 'class-validator';

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
