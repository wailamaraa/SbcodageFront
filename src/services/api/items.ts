import { BaseApiService, ApiResponse, QueryParams } from './base';
import { Item } from '../../types';
import api from '../../utils/api';

interface CreateItemData {
  name: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  category: string;
  fournisseur: string;
  description?: string;
  threshold?: number;
  location?: string;
  itemCode?: string;
  notes?: string;
}

interface UpdateItemData {
  name?: string;
  buyPrice?: number;
  sellPrice?: number;
  quantity?: number;
  category?: string;
  fournisseur?: string;
  description?: string;
  threshold?: number;
  location?: string;
  itemCode?: string;
  notes?: string;
}

interface ItemQueryParams extends QueryParams {
  category?: string;
  fournisseur?: string;
  status?: 'available' | 'low_stock' | 'out_of_stock';
}

interface UpdateQuantityData {
  quantity: number;
  operation: 'add' | 'subtract';
  reference?: string;
  notes?: string;
}

class ItemsApiService extends BaseApiService<Item> {
  constructor() {
    super('/items');
  }

  async getAll(params: ItemQueryParams = {}): Promise<ApiResponse<Item[]>> {
    return super.getAll(params);
  }

  async create(data: CreateItemData | Partial<Item>): Promise<ApiResponse<Item>> {
    const response = await api.post(this.endpoint, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async createItem(data: CreateItemData): Promise<ApiResponse<Item>> {
    return this.create(data);
  }

  async update(id: string, data: UpdateItemData | Partial<Item>): Promise<ApiResponse<Item>> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async updateQuantity(id: string, data: UpdateQuantityData): Promise<ApiResponse<Item>> {
    const response = await api.put(`${this.endpoint}/${id}/quantity`, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async getLowStock(): Promise<ApiResponse<Item[]>> {
    const response = await api.get(`${this.endpoint}/low-stock`);
    return {
      ...response.data,
      status: response.status
    };
  }

  async getHistory(id: string, page = 1, limit = 20, type?: string): Promise<ApiResponse<any[]>> {
    const params: any = { page, limit };
    if (type) params.type = type;
    const response = await api.get(`${this.endpoint}/${id}/history`, { params });
    return {
      ...response.data,
      status: response.status
    };
  }
}

export const itemsApi = new ItemsApiService();