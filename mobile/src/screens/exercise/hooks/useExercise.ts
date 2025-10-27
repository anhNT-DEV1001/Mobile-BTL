// import { Alert } from "react-native";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { API_URL } from "../../../config";
// import { useEffect } from "react";

// export interface Exercise {
//   id: string;
//   name: string;
//   description?: string;
//   category?: string;
//   level?: string;
//   force?: string;
//   equipment?: string;
//   mechanic?: string;
//   primaryMuscles?: string[];
//   secondaryMuscles?: string[];
//   images?: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface Filters {
//   q?: string;
//   force?: string;
//   level?: string;
//   mechanic?: string;
//   equipment?: string;
//   primaryMuscles?: string;
//   category?: string;
//   sort?: string;
//   page?: string;
//   limit?: string;
// }

// // 🧠 API calls dùng API_URL instance
// const getExercises = async (filters: Filters) => {
//   const res = await API_URL.get("/exercises", { params: filters });
//   return res.data;
// };

// const postExercise = async (payload: Exercise) => {
//   const res = await API_URL.post("/exercises", payload);
//   return res.data;
// };

// const patchExercise = async (id: string, payload: Partial<Exercise>) => {
//   const res = await API_URL.patch(`/exercises/${id}`, payload);
//   return res.data;
// };

// const deleteExercise = async (id: string) => {
//   const res = await API_URL.delete(`/exercises/${id}`);
//   return res.data;
// };

// // 🧩 Custom Hook chính
// export function useExercise(filters: Filters) {
//   const queryClient = useQueryClient();

//   const getExercisesQuery = useQuery({
//     queryKey: ["exercises", filters],
//     queryFn: () => getExercises(filters),
//   });

//   useEffect(() => {
//     if (getExercisesQuery.isSuccess && getExercisesQuery.data) {
//       console.log("✅ Lấy danh sách bài tập thành công!");
//       console.log("Tổng:", getExercisesQuery.data?.data?.length ?? 0);
//     }

//     if (getExercisesQuery.isError) {
//       console.error("❌ Lấy danh sách bài tập thất bại:", getExercisesQuery.error);
//       Alert.alert("Lỗi", "Không thể kết nối tới máy chủ hoặc API lỗi!");
//     }
//   }, [getExercisesQuery.isSuccess, getExercisesQuery.isError]);

//   const postExerciseMutation = useMutation({
//     mutationFn: postExercise,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["exercises"] });
//     },
//     onError: () => {
//       Alert.alert("Lỗi", "Không thể thêm bài tập!");
//     },
//   });

//   const patchExerciseMutation = useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: Partial<Exercise> }) =>
//       patchExercise(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["exercises"] });
//     },
//     onError: () => {
//       Alert.alert("Lỗi", "Không thể cập nhật bài tập!");
//     },
//   });

//   const deleteExerciseMutation = useMutation({
//     mutationFn: (id: string) => deleteExercise(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["exercises"] });
//     },
//     onError: () => {
//       Alert.alert("Lỗi", "Không thể xóa bài tập!");
//     },
//   });

//   return {
//     getExercisesQuery,
//     postExerciseMutation,
//     patchExerciseMutation,
//     deleteExerciseMutation,
//   };
// }


import { Alert } from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { API_URL } from "../../../config";
import { api } from "@/src/common/apis";
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
    queryKey: ["exercises", filters],
    queryFn: () =>
      api.get("/exercises", { params: filters }).then((res) => res.data),
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

  return {
    getExercisesQuery,
    postExerciseMutation,
    patchExerciseMutation,
    deleteExerciseMutation,
  };
}

