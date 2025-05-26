import { BaseApiService } from './base';
import { Item } from '../../types';

class InventoryApiService extends BaseApiService<Item> {
  constructor() {
    super('/items');
  }

  async updateQuantity(id: string, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set') {
    const item = await this.getById(id);
    if (item.success) {
      let newQuantity = quantity;
      if (operation === 'add') {
        newQuantity = item.data.quantity + quantity;
      } else if (operation === 'subtract') {
        newQuantity = item.data.quantity - quantity;
      }
      return this.update(id, { quantity: Math.max(0, newQuantity) });
    }
    return item;
  }
}

export const inventoryApi = new InventoryApiService(); 