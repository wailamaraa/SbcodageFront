import api from '../../utils/api';

interface GetStatsParams {
  dateDebut?: string; // ISO date
  dateFin?: string;   // ISO date
}

interface DashboardResponse {
  success: boolean;
  data: {
    counts: {
      items: number;
      fournisseurs: number;
      categories: number;
      cars: number;
      reparations: number;
    };
    inventory: {
      value: number;
      lowStock: number;
      outOfStock: number;
    };
    repairs: {
      active: number;
      completed: number;
      revenue: number;
      dateDebut: string | null;
      dateFin: string | null;
    };
    topItems: Array<{
      _id: string;
      name: string;
      quantity: number;
    }>;
  };
}

export const dashboardApi = {
  getStats: async (params?: GetStatsParams): Promise<DashboardResponse> => {
    const response = await api.get('/dashboard', { params });
    return response.data;
  },
};