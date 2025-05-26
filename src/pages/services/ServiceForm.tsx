import React from 'react';
import { useParams } from 'react-router-dom';
import { servicesApi } from '../../services/api/services';
import { Service } from '../../types';
import { BaseForm } from '../../components/common/BaseForm';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';

const ServiceForm: React.FC = () => {
  const { id } = useParams();
  const {
    data,
    isLoading,
    handleSubmit,
    handleInputChange
  } = useForm<Service>({
    service: servicesApi,
    basePath: '/services',
    id
  });

  return (
    <BaseForm
      title={id ? 'Edit Service' : 'New Service'}
      basePath="/services"
      isLoading={isLoading}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <Input
            label="Name"
            name="name"
            value={data.name || ''}
            onChange={handleInputChange}
            required
            placeholder="Enter service name"
          />
        </div>

        <div>
          <TextArea
            label="Description"
            name="description"
            value={data.description || ''}
            onChange={handleInputChange}
            placeholder="Enter service description"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Price"
              name="price"
              type="number"
              value={data.price || ''}
              onChange={handleInputChange}
              required
              placeholder="Enter service price"
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <Input
              label="Duration (hours)"
              name="duration"
              type="number"
              value={data.duration || ''}
              onChange={handleInputChange}
              required
              placeholder="Enter service duration"
              min={0}
              step={0.5}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Category"
              name="category"
              value={data.category || ''}
              onChange={handleInputChange}
              required
              options={[
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'repair', label: 'Repair' },
                { value: 'diagnostic', label: 'Diagnostic' },
                { value: 'bodywork', label: 'Bodywork' },
                { value: 'other', label: 'Other' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Status"
              name="status"
              value={data.status || ''}
              onChange={handleInputChange}
              required
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
            />
          </div>
        </div>
      </div>
    </BaseForm>
  );
};

export default ServiceForm; 