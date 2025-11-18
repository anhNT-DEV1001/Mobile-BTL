import { api } from "../../../common/apis";

export interface Exercise {
  _id: string;
  id: string;
  name: string;
  category?: string;
  level?: string;
  force?: string;
  equipment?: string;
  mechanic?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
  images?: string[];
  gif?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExerciseFilters {
  q?: string;
  force?: string;
  level?: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ExerciseListResponse {
  items: Exercise[];
  total: number;
  page: number;
  limit: number;
}


export const getExercises = async (filters?: ExerciseFilters): Promise<ExerciseListResponse> => {
  const response = await api.get('/exercises', { params: filters });
  return response.data.data;
};

export const postExercise = async (payload: Partial<Exercise>): Promise<Exercise> => {
  const response = await api.post('/exercises', payload);
  return response.data.data;
};

export const patchExercise = async (id: string, payload: Partial<Exercise>): Promise<Exercise> => {
  const response = await api.patch(`/exercises/${id}`, payload);
  return response.data.data;
};

export const deleteExercise = async (id: string): Promise<Exercise> => {
  const response = await api.delete(`/exercises/${id}`);
  return response.data.data;
};
