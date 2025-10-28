import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserWorkouts, updateUserProfile, getUserWorkoutLevel } from '../services/home.service';
import { User } from "@/src/common/types/auth.type";

export function useHome() {
    // Query để lấy danh sách workouts
    const workoutsQuery = useQuery({
        queryKey: ['user-workouts'],
        queryFn: getUserWorkouts
    });

    // Mutation để cập nhật profile
    const updateProfileMutation = useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) => 
            updateUserProfile(userId, data)
    });

    const userWorkoutLevel = useQuery({
        queryKey : ['user-workouts-level'],
        queryFn : getUserWorkoutLevel
    })

    return {
        workoutsQuery,
        userWorkoutLevel,
        updateProfileMutation,
        isLoading: workoutsQuery.isLoading,
        isError: workoutsQuery.isError,
        isErrorLevel: userWorkoutLevel.isLoading,
        isLoadingLevel: userWorkoutLevel.isLoading
    };
}
