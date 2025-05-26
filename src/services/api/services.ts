import { BaseApiService } from './base';
import { Service } from '../../types';

class ServicesApiService extends BaseApiService<Service> {
  constructor() {
    super('/services');
  }

  async updateStatus(id: string, status: 'active' | 'inactive') {
    return this.update(id, { status });
  }
}

export const servicesApi = new ServicesApiService(); 