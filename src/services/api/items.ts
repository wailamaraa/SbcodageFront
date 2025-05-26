import api from '../../utils/api';
import { Item } from '../../types';

export const itemsApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  create: async (itemData: Partial<Item>) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  update: async (id: string, itemData: Partial<Item>) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  updateQuantity: async (id: string, quantity: number, operation: 'add' | 'subtract') => {
    const response = await api.put(`/items/${id}/quantity`, { quantity, operation });
    return response.data;
  },
};