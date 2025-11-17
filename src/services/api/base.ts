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
  status?: number;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

export class BaseApiService<T> {
  constructor(protected endpoint: string) { }

  async getAll(params: QueryParams = {}): Promise<ApiResponse<T[]>> {
    const response = await api.get(this.endpoint, { params });
    return {
      success: response.data.success ?? true,
      data: response.data.data,
      message: response.data.message,
      errors: response.data.errors,
      count: response.data.count,
      total: response.data.total,
      page: response.data.page,
      pages: response.data.pages,
      status: response.status
    };
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
    return {
      ...response.data,
      status: response.status
    };
  }
} 