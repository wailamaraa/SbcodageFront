import { BaseApiService, ApiResponse, QueryParams } from './base';
import { Reparation } from '../../types';
import api from '../../utils/api';

interface CreateReparationData {
  car: string;
  description: string;
  items?: Array<{ item: string; quantity: number }>;
  services?: Array<{ service: string; notes?: string }>;
  technician?: string;
  laborCost?: number;
  notes?: string;
}

interface UpdateReparationData {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  endDate?: string;
}

interface ReparationQueryParams extends QueryParams {
  car?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technician?: string;
  startDate?: string;
  endDate?: string;
}

class ReparationsApiService extends BaseApiService<Reparation> {
  protected api;

  constructor() {
    super('/reparations');
    this.api = api;
  }

  async getAll(params: ReparationQueryParams = {}): Promise<ApiResponse<Reparation[]>> {
    return super.getAll(params);
  }

  async getById(id: string): Promise<ApiResponse<Reparation>> {
    const response = await this.api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: CreateReparationData | Partial<Reparation>): Promise<ApiResponse<Reparation>> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  async createReparation(data: CreateReparationData): Promise<ApiResponse<Reparation>> {
    return this.create(data);
  }

  async update(id: string, data: UpdateReparationData | Partial<Reparation>): Promise<ApiResponse<Reparation>> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async updateStatus(id: string, status: Reparation['status']): Promise<ApiResponse<Reparation>> {
    return this.update(id, { status });
  }

  async updateFull(id: string, data: {
    description?: string;
    items?: Array<{ item: string; quantity: number }>;
    services?: Array<{ service: string; notes?: string }>;
    technician?: string;
    laborCost?: number;
    status?: Reparation['status'];
    notes?: string;
  }): Promise<ApiResponse<Reparation>> {
    try {
      const url = `/reparations/${id}/full`;
      console.log('Making PUT request to:', url);
      console.log('With data:', data);

      const response = await this.api.put<ApiResponse<Reparation>>(url, data);
      return response.data;
    } catch (error: any) {
      console.error('Error in updateFull:', error);
      return {
        success: false,
        data: {} as Reparation,
        message: error.response?.data?.message || 'Failed to update reparation',
        errors: error.response?.data?.errors,
        status: error.response?.status
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const url = `/reparations/${id}`;
      console.log('Making DELETE request to:', url);

      const response = await this.api.delete<ApiResponse<void>>(url);
      return {
        ...response.data,
        status: response.status
      };
    } catch (error: any) {
      console.error('Error in delete:', error);
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'Failed to delete reparation',
        errors: error.response?.data?.errors,
        status: error.response?.status
      };
    }
  }
}

export const reparationsApi = new ReparationsApiService(); 