import { BaseApiService } from './base';
import { Category } from '../../types';

class CategoriesService extends BaseApiService<Category> {
  constructor() {
    super('/categories');
  }
}

export const categoriesApi = new CategoriesService();