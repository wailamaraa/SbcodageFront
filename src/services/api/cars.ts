import { BaseApiService } from './base';
import { Car } from '../../types';

class CarsApiService extends BaseApiService<Car> {
  constructor() {
    super('/cars');
  }
}

export const carsApi = new CarsApiService();