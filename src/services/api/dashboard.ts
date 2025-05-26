import api from '../../utils/api';
import { DashboardStats } from '../../types';

interface GetStatsParams {
  dateDebut?: string;
  dateFin?: string;
}

export const dashboardApi = {
  getStats: async (params?: GetStatsParams) => {
    const response = await api.get('/dashboard', { params });
    return response.data;
  },
};