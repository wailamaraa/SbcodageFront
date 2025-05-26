import { BaseApiService } from './base';
import { User } from '../../types';

class UsersApiService extends BaseApiService<User> {
  constructor() {
    super('/users');
  }
}

export const usersApi = new UsersApiService();