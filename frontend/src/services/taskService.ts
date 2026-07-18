import axios from 'axios';
import type { TaskFormData } from '../types/Task';

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getTasks = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const createTask = async (data: TaskFormData) => {
  const response = await axios.post(API_URL, data, getAuthHeader());
  return response.data;
};

export const updateTask = async (id: string, data: Partial<TaskFormData>) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};