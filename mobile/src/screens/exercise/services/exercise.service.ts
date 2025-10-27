import { API_URL } from "../../../config";
import {api} from '../../../common/apis';
export interface Exercise {
  data: any;
  status: string;
  id: string;
  name: string;
  category?: string;
  level?: string;
  force?: string;
  equipment?: string;
  mechanic?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}
export const getExercises = async (payload : Exercise) : Promise<Exercise> => {
    const res = await api.get('/exercises', { params: payload });
    return res.data;
}

export const postExercise = async (payload : Exercise) : Promise<Exercise> => {
    const res = await api.post('/exercises', payload);
    return res.data;
}

export const patchExercise = async (id: string, payload : Partial<Exercise>) : Promise<Exercise> => {
  const res = await api.patch('/exercises/${id}', payload)
  return res.data;
}

export const deleteExercise = async (id: string) : Promise<Exercise> => {
  const res = await api.delete('/exercises/${id}');
  return res.data;
}
