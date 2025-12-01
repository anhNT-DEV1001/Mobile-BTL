import { api } from "@/src/common/apis";
import { BaseResponse } from "@/src/common/types";

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  profile: {
    avatar?: string;
    name: string;
    gender: string;
    dob: string | Date;
    height: number;
    weight: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload {
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
  status?: string;
  profile?: {
    avatar?: string;
    name?: string;
    gender?: string;
    dob?: string | Date;
    height?: number;
    weight?: number;
  };
}

// GET /auth/me - Get current user profile
export const getUserProfile = async (): Promise<BaseResponse<UserProfile>> => {
  const response = await api.get<BaseResponse<UserProfile>>("/auth/me");
  return response.data;
};

// PATCH /user/:id - Update user profile
export const updateUserProfile = async (
  userId: string,
  data: UpdateUserProfilePayload
): Promise<BaseResponse<UserProfile>> => {
  // Remove undefined fields to avoid validation errors
  const cleanData = JSON.parse(JSON.stringify(data));
  
  const response = await api.patch<BaseResponse<UserProfile>>(
    `/user/${userId}`,
    cleanData
  );
  return response.data;
};

// POST /user/:id/avatar - Upload avatar
export const uploadAvatar = async (
  userId: string,
  imageUri: string
): Promise<BaseResponse<UserProfile>> => {
  const formData = new FormData();
  
  // Get file extension from uri
  const uriParts = imageUri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  
  formData.append('avatar', {
    uri: imageUri,
    name: `avatar.${fileType}`,
    type: `image/${fileType}`,
  } as any);

  const response = await api.post<BaseResponse<UserProfile>>(
    `/user/${userId}/avatar`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};