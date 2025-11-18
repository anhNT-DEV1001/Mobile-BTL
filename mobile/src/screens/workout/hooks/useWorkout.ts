import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getUserExercisesByWorkout,
  createUserExercise,
  updateUserExercise,
  deleteUserExercise,
  getWorkoutTemplates,
  getWorkoutTemplateById,
  createWorkoutFromTemplate,
  createWorkoutTemplate,
  updateWorkoutTemplate,
  deleteWorkoutTemplate,
  type Workout,
  type UserExercise,
  type WorkoutTemplate,
  type CreateWorkoutDto,
  type CreateUserExerciseDto,
  type CreateWorkoutTemplateDto,
  type UpdateWorkoutTemplateDto,
} from "../services/workout.service";

// Hook để lấy danh sách workouts
export const useWorkouts = () => {
  return useQuery({
    queryKey: ["workouts"],
    queryFn: getWorkouts,
  });
};

// Hook để lấy chi tiết một workout
export const useWorkout = (id: string) => {
  return useQuery({
    queryKey: ["workout", id],
    queryFn: () => getWorkoutById(id),
    enabled: !!id,
  });
};

// Hook để lấy danh sách exercises của một workout
export const useWorkoutExercises = (workoutId: string) => {
  return useQuery({
    queryKey: ["workout-exercises", workoutId],
    queryFn: () => getUserExercisesByWorkout(workoutId),
    enabled: !!workoutId,
  });
};

// Hook để tạo workout mới
export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkoutDto) => createWorkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
};

// Hook để update workout
export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWorkoutDto> }) =>
      updateWorkout(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["workout", variables.id] });
    },
  });
};

// Hook để xóa workout
export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWorkout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
};

// Hook để thêm exercise vào workout
export const useCreateUserExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserExerciseDto) => createUserExercise(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises", variables.workout] });
    },
  });
};

// Hook để update exercise trong workout
export const useUpdateUserExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserExerciseDto> }) =>
      updateUserExercise(id, data),
    onSuccess: (data) => {
      if (data && data.workout) {
        queryClient.invalidateQueries({ queryKey: ["workout-exercises", data.workout] });
      }
    },
  });
};

// Hook để xóa exercise khỏi workout
export const useDeleteUserExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserExercise(id),
    onSuccess: (data) => {
      if (data && data.workout) {
        queryClient.invalidateQueries({ queryKey: ["workout-exercises", data.workout] });
      }
    },
  });
};

// ==================== WORKOUT TEMPLATES ====================

// Hook để lấy danh sách templates
export const useWorkoutTemplates = () => {
  return useQuery({
    queryKey: ["workout-templates"],
    queryFn: getWorkoutTemplates,
  });
};

// Hook để lấy chi tiết một template
export const useWorkoutTemplate = (id: string) => {
  return useQuery({
    queryKey: ["workout-template", id],
    queryFn: () => getWorkoutTemplateById(id),
    enabled: !!id,
  });
};

// Hook để tạo workout từ template
export const useCreateWorkoutFromTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, date }: { templateId: string; date: string }) =>
      createWorkoutFromTemplate(templateId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
};

// Hook để tạo template mới
export const useCreateWorkoutTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkoutTemplateDto) => createWorkoutTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-templates"] });
    },
  });
};

// Hook để update template
export const useUpdateWorkoutTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkoutTemplateDto }) =>
      updateWorkoutTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workout-templates"] });
      queryClient.invalidateQueries({ queryKey: ["workout-template", variables.id] });
    },
  });
};

// Hook để xóa template
export const useDeleteWorkoutTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWorkoutTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-templates"] });
    },
  });
};
