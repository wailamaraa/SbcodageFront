import { BaseApiService } from './base';
import { Supplier } from '../../types';

class SuppliersApiService extends BaseApiService<Supplier> {
  constructor() {
    super('/fournisseurs');
  }
}

export const suppliersApi = new SuppliersApiService();