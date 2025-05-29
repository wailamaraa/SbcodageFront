import { BaseApiService } from './base';
import { Reparation, ReparationItem, ReparationService } from '../../types';

class ReparationsApiService extends BaseApiService<Reparation> {
  constructor() {
    super('/reparations');
  }

  async updateStatus(id: string, status: Reparation['status']) {
    return this.update(id, { status });
  }

  async addItem(id: string, itemData: { item: string; quantity: number; price: number }) {
    const reparation = await this.getById(id);
    if (reparation.success) {
      const updatedItems = [...(reparation.data.items || []), itemData];
      return this.update(id, { items: updatedItems });
    }
    return reparation;
  }

  async removeItem(id: string, itemId: string) {
    const reparation = await this.getById(id);
    if (reparation.success) {
      const updatedItems = reparation.data.items.filter((item: ReparationItem) =>
        typeof item.item === 'string' ? item.item !== itemId : item.item._id !== itemId
      );
      return this.update(id, { items: updatedItems });
    }
    return reparation;
  }

  async addService(id: string, serviceData: { service: string; notes?: string }) {
    const reparation = await this.getById(id);
    if (reparation.success) {
      const updatedServices = [...(reparation.data.services || []), serviceData];
      return this.update(id, { services: updatedServices });
    }
    return reparation;
  }

  async removeService(id: string, serviceId: string) {
    const reparation = await this.getById(id);
    if (reparation.success) {
      const updatedServices = reparation.data.services.filter((service: ReparationService) =>
        typeof service.service === 'string' ? service.service !== serviceId : service.service._id !== serviceId
      );
      return this.update(id, { services: updatedServices });
    }
    return reparation;
  }
}

export const reparationsApi = new ReparationsApiService(); 