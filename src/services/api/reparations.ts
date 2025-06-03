import { BaseApiService } from './base';
import { Reparation, ReparationItem, ReparationService } from '../../types';
import api from '../../utils/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
  status?: number;
}

class ReparationsApiService extends BaseApiService<Reparation> {
  protected api;

  constructor() {
    super('/reparations');
    this.api = api;
  }

  async updateStatus(id: string, status: Reparation['status']) {
    return this.update(id, { status });
  }

  async addItem(id: string, itemData: { item: string; quantity: number; price: number }) {
    const reparation = await this.getById(id);
    if (reparation.success && reparation.data) {
      const updatedItems = [...(reparation.data.items || []), {
        _id: '', // Will be set by the server
        item: itemData.item,
        quantity: itemData.quantity,
        price: itemData.price
      }];
      return this.update(id, { items: updatedItems });
    }
    return reparation;
  }

  async removeItem(id: string, itemId: string) {
    const reparation = await this.getById(id);
    if (reparation.success && reparation.data) {
      const updatedItems = reparation.data.items.filter((item: ReparationItem) =>
        typeof item.item === 'string' ? item.item !== itemId : item.item._id !== itemId
      );
      return this.update(id, { items: updatedItems });
    }
    return reparation;
  }

  async addService(id: string, serviceData: { service: string; notes?: string }) {
    const reparation = await this.getById(id);
    if (reparation.success && reparation.data) {
      const updatedServices = [...(reparation.data.services || []), {
        _id: '', // Will be set by the server
        service: serviceData.service,
        price: 0, // Will be set by the server
        notes: serviceData.notes || ''
      }];
      return this.update(id, { services: updatedServices });
    }
    return reparation;
  }

  async removeService(id: string, serviceId: string) {
    const reparation = await this.getById(id);
    if (reparation.success && reparation.data) {
      const updatedServices = reparation.data.services.filter((service) =>
        typeof service.service === 'string' ? service.service !== serviceId : service.service._id !== serviceId
      );
      return this.update(id, { services: updatedServices });
    }
    return reparation;
  }

  async updateFull(id: string, data: {
    description?: string;
    items?: Array<{ item: string; quantity: number }>;
    services?: Array<{ service: string; notes?: string }>;
    technician?: string;
    laborCost?: number;
    status?: Reparation['status'];
    notes?: string;
  }): Promise<ApiResponse<Reparation>> {
    try {
      const url = `/reparations/${id}/full`;
      console.log('Making PUT request to:', url);
      console.log('With data:', data);

      const response = await this.api.put<ApiResponse<Reparation>>(url, data);
      return {
        ...response.data,
        status: response.status
      };
    } catch (error: any) {
      console.error('Error in updateFull:', error);
      return {
        success: false,
        data: {} as Reparation,
        message: error.response?.data?.message || 'Failed to update reparation',
        errors: error.response?.data?.errors,
        status: error.response?.status
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const url = `/reparations/${id}`;
      console.log('Making DELETE request to:', url);

      const response = await this.api.delete<ApiResponse<void>>(url);
      return {
        ...response.data,
        status: response.status
      };
    } catch (error: any) {
      console.error('Error in delete:', error);
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'Failed to delete reparation',
        errors: error.response?.data?.errors,
        status: error.response?.status
      };
    }
  }
}

export const reparationsApi = new ReparationsApiService(); 