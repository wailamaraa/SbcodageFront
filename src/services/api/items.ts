import { BaseApiService } from './base';
import { Item } from '../../types';
import api from '../../utils/api';

class ItemsApiService extends BaseApiService<Item> {
  constructor() {
    super('/items');
  }

  async updateQuantity(id: string, quantity: number, operation: 'add' | 'subtract') {
    const response = await api.put(`${this.endpoint}/${id}/quantity`, {
      quantity,
      operation
    });
    return response.data;
  }
}

export const itemsApi = new ItemsApiService();