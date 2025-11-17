import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserWorkouts, updateUserProfile, getUserBmiLevel } from '../services/home.service';
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

    // Query để lấy BMI level
    const userBmiLevel = useQuery({
        queryKey: ['user-bmi-level'],
        queryFn: getUserBmiLevel
    });

    return {
        workoutsQuery,
        userBmiLevel,
        updateProfileMutation,
        isLoading: workoutsQuery.isLoading,
        isError: workoutsQuery.isError,
        isErrorBmi: userBmiLevel.isError,
        isLoadingBmi: userBmiLevel.isLoading
    };
}
