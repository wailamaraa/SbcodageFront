import { BaseApiService } from './base';
import { Item } from '../../types';
import api from '../../utils/api';

class InventoryApiService extends BaseApiService<Item> {
  constructor() {
    super('/items');
  }

  async updateQuantity(id: string, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set', notes?: string, reference?: string) {
    if (operation === 'set') {
      // Direct update for 'set' operation
      return this.update(id, { quantity: Math.max(0, quantity) } as Partial<Item>);
    }
    
    // Use the API endpoint for add/subtract operations
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

export const inventoryApi = new InventoryApiService();