import { BaseApiService } from './base';
import { Vehicle } from '../../types';

class VehiclesApiService extends BaseApiService<Vehicle> {
  constructor() {
    super('/vehicles');
  }
}

export const vehiclesApi = new VehiclesApiService(); 