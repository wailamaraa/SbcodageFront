import { BaseApiService, ApiResponse, QueryParams } from './base';
import { Car } from '../../types';
import api from '../../utils/api';

interface CreateCarData {
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  vin?: string;
  owner: {
    name: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
}

interface UpdateCarData {
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  owner?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
}

interface CarQueryParams extends QueryParams {
  search?: string; // searches make, model, licensePlate, owner.name
  year?: number;
}

class CarsApiService extends BaseApiService<Car> {
  constructor() {
    super('/cars');
  }

  async getAll(params: CarQueryParams = {}): Promise<ApiResponse<Car[]>> {
    return super.getAll(params);
  }

  async create(data: CreateCarData | Partial<Car>): Promise<ApiResponse<Car>> {
    const response = await api.post(this.endpoint, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async createCar(data: CreateCarData): Promise<ApiResponse<Car>> {
    return this.create(data);
  }

  async update(id: string, data: UpdateCarData): Promise<ApiResponse<Car>> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return {
      ...response.data,
      status: response.status
    };
  }
}

export const carsApi = new CarsApiService();