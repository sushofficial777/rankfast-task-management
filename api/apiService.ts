import axiosInstance from "./axiosInstance";
import { Task } from "@/types/task";
export const BASE_URL = 'http://localhost:4000';
import {
  SignInRoute,
  ResisterRoute,
  CreateTaskRoute,
  GetAllTasksRoute,
  GetTaskByIdRoute,
  UpdateTaskRoute,
  DeleteTaskRoute,
  getAllUsersForSelectRoute,
  getUnreadNotificationRoute,
  getAllNotificationRoute,
  markNotificationAsReadRoute
} from "./apiEndpoints";

export function SignInMethod(data: any) {
  return axiosInstance.post(SignInRoute, data, {
    withCredentials: true,
  });
}

export function RegisterMethod(data: any) {
  return axiosInstance.post(ResisterRoute, data, {
    withCredentials: true,
  });
}

export function createTask(data: Task) {
  return axiosInstance.post(CreateTaskRoute, data, {
    withCredentials: true
  });
}

export function getAllTasks() {
  return axiosInstance.get(GetAllTasksRoute, {
    withCredentials: true
  });
}

export function getTaskByIdMethod(id: string) {
  return axiosInstance.get(GetTaskByIdRoute(id), {
    withCredentials: true
  });
}

export function updateTaskMethod(id: string, data: any) {
  return axiosInstance.put(UpdateTaskRoute(id), data, {
    withCredentials: true
  });
}

export function deleteTaskMethod(id: string) {
  return axiosInstance.delete(DeleteTaskRoute(id), {
    withCredentials: true
  });
}

export function getAllUsersForSelectMethod() {
  return axiosInstance.get(getAllUsersForSelectRoute, {
    withCredentials: true
  });
}



// Notification Methods

export function getUnreadNotificationMethod() {
  return axiosInstance.get(getUnreadNotificationRoute, {
    withCredentials: true
  });
}

export function markNotificationAsReadMethod(id: string) {
  return axiosInstance.get(markNotificationAsReadRoute(id), {
    withCredentials: true
  });
}

export function getAllNotificationMethod() {
  return axiosInstance.get(getAllNotificationRoute, {
    withCredentials: true
  });
}

