import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
  UpdateUserProfilePayload,
} from "../services/profile.service";
import { useAuthStore } from "@/src/common/stores";

// Query key constants
export const PROFILE_QUERY_KEY = ["userProfile"];

// Hook to get user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to update user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserProfilePayload;
    }) => updateUserProfile(userId, data),
    onSuccess: (response) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      
      // Invalidate measurement queries (BMI and energy needs)
      queryClient.invalidateQueries({ queryKey: ["userBmi"] });
      queryClient.invalidateQueries({ queryKey: ["userEnergyNeeds"] });
      
      // Update auth store with new user data
      if (response?.data) {
        const currentAuth = useAuthStore.getState();
        if (currentAuth.tokens) {
          useAuthStore.getState().setAuth(response.data, currentAuth.tokens);
        }
      }
    },
  });
};
