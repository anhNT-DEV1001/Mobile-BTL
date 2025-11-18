import { api } from "@/src/common/apis/axios";

export interface Workout {
    id: string;
    name: string;
    date: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface ExerciseSet {
    reps: number;
    weight?: number;
    level?: string | null;
}

export interface UserExercise {
    id: string;
    exercise: any;
    workout: string;
    sets: ExerciseSet[];
    totalVolume?: number;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkoutTemplate {
    id: string;
    name: string;
    exercises: any[]; // Array of Exercise objects (populated)
    level?: string | null;
    type?: string | null;
    note?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkoutDto {
    name?: string;
    date: string;
    note?: string;
}

export interface CreateUserExerciseDto {
    exercise: string;
    workout: string;
    sets: { reps: number; weight?: number }[];
    note?: string;
}

export interface CreateWorkoutTemplateDto {
    name: string;
    exercises: string[]; // Array of exercise IDs
    level?: string;
    type?: string;
    note?: string;
}

export interface UpdateWorkoutTemplateDto {
    name?: string;
    exercises?: string[]; // Array of exercise IDs
    level?: string;
    type?: string;
    note?: string;
}

// ==================== WORKOUT APIs ====================

export const getWorkouts = async (): Promise<Workout[]> => {
    const response = await api.get('/workout');
    return response.data.data;
};

export const getWorkoutById = async (id: string): Promise<Workout> => {
    const response = await api.get(`/workout/${id}`);
    return response.data.data;
};

export const createWorkout = async (data: CreateWorkoutDto): Promise<Workout> => {
    const response = await api.post('/workout', data);
    return response.data.data;
};

export const updateWorkout = async (id: string, data: Partial<CreateWorkoutDto>): Promise<Workout> => {
    const response = await api.patch(`/workout/${id}`, data);
    return response.data.data;
};

export const deleteWorkout = async (id: string): Promise<Workout> => {
    const response = await api.delete(`/workout/${id}`);
    return response.data.data;
};

// ==================== USER EXERCISE APIs ====================

export const getUserExercisesByWorkout = async (workoutId: string): Promise<UserExercise[]> => {
    const response = await api.get(`/workout/${workoutId}/exercises`);
    return response.data.data;
};

export const createUserExercise = async (data: CreateUserExerciseDto): Promise<UserExercise> => {
    const response = await api.post('/workout/exercises', data);
    return response.data.data;
};

export const updateUserExercise = async (id: string, data: Partial<CreateUserExerciseDto>): Promise<UserExercise> => {
    const response = await api.patch(`/workout/exercises/${id}`, data);
    return response.data.data;
};

export const deleteUserExercise = async (id: string): Promise<UserExercise> => {
    const response = await api.delete(`/workout/exercises/${id}`);
    return response.data.data;
};

// ==================== WORKOUT TEMPLATE APIs ====================

export const getWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
    const response = await api.get('/workout/templates/list');
    return response.data.data;
};

export const getWorkoutTemplateById = async (id: string): Promise<WorkoutTemplate> => {
    const response = await api.get(`/workout/templates/${id}`);
    return response.data.data;
};

export const createWorkoutTemplate = async (data: CreateWorkoutTemplateDto): Promise<WorkoutTemplate> => {
    const response = await api.post('/workout/templates', data);
    return response.data.data;
};

export const updateWorkoutTemplate = async (id: string, data: UpdateWorkoutTemplateDto): Promise<WorkoutTemplate> => {
    const response = await api.patch(`/workout/templates/${id}`, data);
    return response.data.data;
};

export const deleteWorkoutTemplate = async (id: string): Promise<WorkoutTemplate> => {
    const response = await api.delete(`/workout/templates/${id}`);
    return response.data.data;
};

export const createWorkoutFromTemplate = async (templateId: string, date: string): Promise<any> => {
    const response = await api.post(`/workout/templates/${templateId}/create-workout`, { date });
    return response.data.data;
};

// ==================== UTILITY APIs ====================

export const calculateStrengthLevel = async (weight: number, reps: number): Promise<any> => {
    const response = await api.post('/workout/calculate-strength-level', { weight, reps });
    return response.data.data;
};
