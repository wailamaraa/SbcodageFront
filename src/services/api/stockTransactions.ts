import { BaseApiService } from './base';
import { StockTransaction } from '../../types';
import api from '../../utils/api';

class StockTransactionsApiService extends BaseApiService<StockTransaction> {
  constructor() {
    super('/stock-transactions');
  }

  async getStats() {
    const response = await api.get(`${this.endpoint}/stats`);
    return response.data;
  }

  async getItemHistory(itemId: string, page = 1, limit = 20) {
    const response = await api.get(`/items/${itemId}/history`, {
      params: { page, limit }
    });
    return response.data;
  }
}

export const stockTransactionsApi = new StockTransactionsApiService();
