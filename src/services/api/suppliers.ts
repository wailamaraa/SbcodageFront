import { BaseApiService, ApiResponse } from './base';
import { Supplier } from '../../types';
import api from '../../utils/api';

interface CreateSupplierData {
  name: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

interface UpdateSupplierData {
  name?: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

class SuppliersApiService extends BaseApiService<Supplier> {
  constructor() {
    super('/fournisseurs');
  }

  async create(data: CreateSupplierData): Promise<ApiResponse<Supplier>> {
    const response = await api.post(this.endpoint, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async update(id: string, data: UpdateSupplierData): Promise<ApiResponse<Supplier>> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return {
      ...response.data,
      status: response.status
    };
  }
}

export const suppliersApi = new SuppliersApiService();