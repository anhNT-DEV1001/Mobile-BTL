import axios from "axios";
import { API_URL } from "../config";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Projects
export const getProjects = () => api.get("/projects");

// Participants
export const getParticipants = () => api.get("/participants");

// Assignments
export const getAssignments = (params?: any) => api.get("/assignments", { params });
export const createAssignment = (data: any) => api.post("/assignments", data);
export const updateAssignment = (id: string, data: any) => api.patch(`/assignments/${id}`, data);
