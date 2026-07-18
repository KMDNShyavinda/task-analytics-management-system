import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/analytics`;
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export interface AnalyticsSummary {
  totalActiveTasks: number;
  completedToday: number;
  overdue: number;
  statusBreakdown: {
    'To Do': number;
    'In Progress': number;
    'Completed': number;
  };
  priorityBreakdown: {
    Low: number;
    Medium: number;
    High: number;
  };
}

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const response = await axios.get(`${API_URL}/summary`, getAuthHeader());
  return response.data;
};