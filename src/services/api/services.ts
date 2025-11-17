import { BaseApiService, ApiResponse, QueryParams } from './base';
import { Service } from '../../types';
import api from '../../utils/api';

interface CreateServiceData {
  name: string;
  description?: string;
  price: number;
  duration?: number;
  category?: 'maintenance' | 'repair' | 'diagnostic' | 'bodywork' | 'other';
  status?: 'active' | 'inactive';
  notes?: string;
}

interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: 'maintenance' | 'repair' | 'diagnostic' | 'bodywork' | 'other';
  status?: 'active' | 'inactive';
  notes?: string;
}

interface ServiceQueryParams extends QueryParams {
  category?: 'maintenance' | 'repair' | 'diagnostic' | 'bodywork' | 'other';
  status?: 'active' | 'inactive';
}

class ServicesApiService extends BaseApiService<Service> {
  constructor() {
    super('/services');
  }

  async getAll(params: ServiceQueryParams = {}): Promise<ApiResponse<Service[]>> {
    return super.getAll(params);
  }

  async create(data: CreateServiceData | Partial<Service>): Promise<ApiResponse<Service>> {
    const response = await api.post(this.endpoint, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async createService(data: CreateServiceData): Promise<ApiResponse<Service>> {
    return this.create(data);
  }

  async update(id: string, data: UpdateServiceData | Partial<Service>): Promise<ApiResponse<Service>> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async updateStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<Service>> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`${this.endpoint}/${id}`);
    return {
      ...response.data,
      status: response.status
    };
  }
}

export const servicesApi = new ServicesApiService(); 