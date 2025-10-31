import { Alert } from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { API_URL } from "../../../config";
import { useEffect } from "react";
import { getExercises , postExercise , patchExercise , deleteExercise } from "../services/exercise.service";

export interface Exercise {
  id: string;
  name: string;
  description?: string;
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

interface Filters {
  q?: string;
  force?: string;
  level?: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles?: string;
  category?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export function useExercise(filters: Filters) {
  const getExercisesQuery = useQuery({
    queryKey: ["exercises" , filters],
    queryFn : async () => await getExercises(filters)
  });

  const postExerciseMutation = useMutation({
    mutationFn: postExercise,
    onSuccess: () => {
      
    },
    onError: () => {
      // Handle error
    },
  });

  const patchExerciseMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Exercise> }) =>
      patchExercise(id, payload),
    onSuccess: () => {
      // Handle success
    },
    onError: () => {
      // Handle error
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: (id: string) => deleteExercise(id),
    onSuccess: () => {
      // Handle success
    },
    onError: () => {
      // Handle error
    },
  });
  const exercises = getExercisesQuery || [];
  return {
    getExercisesQuery,
    postExerciseMutation,
    patchExerciseMutation,
    deleteExerciseMutation,
    exercises,
  };
}

