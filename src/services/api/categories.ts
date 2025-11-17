import { BaseApiService, ApiResponse } from './base';
import { Category } from '../../types';
import api from '../../utils/api';

interface CreateCategoryData {
  name: string;
  description?: string;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
}

class CategoriesService extends BaseApiService<Category> {
  constructor() {
    super('/categories');
  }

  async create(data: CreateCategoryData): Promise<ApiResponse<Category>> {
    const response = await api.post(this.endpoint, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async update(id: string, data: UpdateCategoryData): Promise<ApiResponse<Category>> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return {
      ...response.data,
      status: response.status
    };
  }
}

export const categoriesApi = new CategoriesService();