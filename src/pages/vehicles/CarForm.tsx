import React from 'react';
import { useParams } from 'react-router-dom';
import { carsApi } from '../../services/api/cars';
import { BaseForm } from '../../components/common/BaseForm';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

interface CarFormData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  status: 'active' | 'inactive';
  owner: {
    name: string;
    email: string;
    phone?: string;
  };
}

const DEFAULT_FORM_DATA: CarFormData = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  vin: '',
  status: 'active',
  owner: {
    name: '',
    email: '',
    phone: ''
  }
};

const CarForm: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, handleSubmit, handleInputChange } = useForm<CarFormData>({
    service: carsApi,
    id,
    basePath: '/vehicles',
    initialData: DEFAULT_FORM_DATA
  });

  // Ensure data is initialized with default values
  const formData = { ...DEFAULT_FORM_DATA, ...data };

  return (
    <BaseForm
      title={id ? 'Edit Vehicle' : 'New Vehicle'}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      basePath="/vehicles"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            name="make"
            label="Make"
            placeholder="e.g., Toyota"
            value={formData.make}
            onChange={handleInputChange}
            required
          />

          <Input
            name="model"
            label="Model"
            placeholder="e.g., Camry"
            value={formData.model}
            onChange={handleInputChange}
            required
          />

          <Input
            name="year"
            label="Year"
            type="number"
            min={1900}
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={handleInputChange}
            required
          />

          <Input
            name="licensePlate"
            label="License Plate"
            placeholder="e.g., ABC-123"
            value={formData.licensePlate}
            onChange={handleInputChange}
            required
          />

          <Input
            name="vin"
            label="VIN"
            placeholder="Vehicle Identification Number"
            value={formData.vin}
            onChange={handleInputChange}
          />

          <Select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Owner Information
          </h3>

          <Input
            name="owner.name"
            label="Owner Name"
            placeholder="Full name"
            value={formData.owner.name}
            onChange={handleInputChange}
            required
          />

          <Input
            name="owner.email"
            label="Owner Email"
            type="email"
            placeholder="email@example.com"
            value={formData.owner.email}
            onChange={handleInputChange}
            required
          />

          <Input
            name="owner.phone"
            label="Owner Phone"
            placeholder="Phone number"
            value={formData.owner.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </BaseForm>
  );
};

export default CarForm; 