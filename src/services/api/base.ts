import api from '../../utils/api';

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: any;
}

export interface ApiError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export class BaseApiService<T> {
  constructor(private endpoint: string) {}

  async getAll(params: QueryParams = {}): Promise<ApiResponse<T[]>> {
    const response = await api.get(this.endpoint, { params });
    return response.data;
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`${this.endpoint}/${id}`);
    return response.data;
  }
} 