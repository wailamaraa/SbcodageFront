import { BaseApiService, ApiResponse, QueryParams } from './base';
import { StockTransaction } from '../../types';
import api from '../../utils/api';

interface CreateStockTransactionData {
  item: string;
  type: 'purchase' | 'adjustment' | 'damage' | 'return_to_supplier';
  quantity: number;
  fournisseur?: string;
  reference?: string;
  notes?: string;
}

interface StockTransactionQueryParams extends QueryParams {
  item?: string;
  type?: 'purchase' | 'sale' | 'adjustment' | 'reparation_use' | 'reparation_return' | 'damage' | 'return_to_supplier';
  reparation?: string;
  startDate?: string;
  endDate?: string;
}

interface StockTransactionStats {
  _id: string;
  count: number;
  totalQuantity: number;
  totalAmount: number;
}

class StockTransactionsApiService extends BaseApiService<StockTransaction> {
  constructor() {
    super('/stock-transactions');
  }

  async getAll(params: StockTransactionQueryParams = {}): Promise<ApiResponse<StockTransaction[]>> {
    return super.getAll(params);
  }

  async create(data: CreateStockTransactionData): Promise<ApiResponse<StockTransaction>> {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  async getStats(): Promise<ApiResponse<StockTransactionStats[]>> {
    const response = await api.get(`${this.endpoint}/stats`);
    return response.data;
  }

  async getItemHistory(itemId: string, page = 1, limit = 20): Promise<ApiResponse<StockTransaction[]>> {
    const response = await api.get(`/items/${itemId}/history`, {
      params: { page, limit }
    });
    return response.data;
  }

  // Stock transactions cannot be updated or deleted - they are audit records
}

export const stockTransactionsApi = new StockTransactionsApiService();
