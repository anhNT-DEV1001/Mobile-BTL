import { Alert } from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getExercises, postExercise, patchExercise, deleteExercise, type ExerciseFilters, type Exercise } from "../services/exercise.service";



export function useExercise(filters?: ExerciseFilters) {
  const getExercisesQuery = useQuery({
    queryKey: ["exercises", filters],
    queryFn: async () => await getExercises(filters)
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

// Simplified hook to just get exercises
export const useExercises = (filters?: ExerciseFilters) => {
  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: () => getExercises(filters),
  });
};

