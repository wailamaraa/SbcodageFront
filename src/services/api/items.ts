import { BaseApiService } from './base';
import { Item } from '../../types';
import api from '../../utils/api';

class ItemsApiService extends BaseApiService<Item> {
  constructor() {
    super('/items');
  }

  async updateQuantity(id: string, quantity: number, operation: 'add' | 'subtract', notes?: string, reference?: string) {
    const response = await api.put(`${this.endpoint}/${id}/quantity`, {
      quantity,
      operation,
      notes,
      reference
    });
    return response.data;
  }

  async getLowStock() {
    const response = await api.get(`${this.endpoint}/low-stock`);
    return response.data;
  }

  async getHistory(id: string, page = 1, limit = 20, type?: string) {
    const params: any = { page, limit };
    if (type) params.type = type;
    const response = await api.get(`${this.endpoint}/${id}/history`, { params });
    return response.data;
  }
}

export const itemsApi = new ItemsApiService();