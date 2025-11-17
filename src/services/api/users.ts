import { BaseApiService, ApiResponse } from './base';
import { User } from '../../types';
import api from '../../utils/api';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}

class UsersApiService extends BaseApiService<User> {
  constructor() {
    super('/users');
  }

  async create(data: CreateUserData): Promise<ApiResponse<User>> {
    const response = await api.post(this.endpoint, data);
    return {
      ...response.data,
      status: response.status
    };
  }

  async update(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return {
      ...response.data,
      status: response.status
    };
  }
}

export const usersApi = new UsersApiService();