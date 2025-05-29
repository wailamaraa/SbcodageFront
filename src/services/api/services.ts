import { BaseApiService } from './base';
import { Service } from '../../types';
import api from '../../utils/api';

class ServicesApiService extends BaseApiService<Service> {
  constructor() {
    super('/services');
  }

  async updateStatus(id: string, status: 'active' | 'inactive') {
    return this.update(id, { status });
  }

  async delete(id: string) {
    const response = await api.post(`${this.endpoint}/${id}/remove`);
    return response.data;
  }
}

export const servicesApi = new ServicesApiService(); 