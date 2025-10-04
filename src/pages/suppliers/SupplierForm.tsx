import React from 'react';
import { useParams } from 'react-router-dom';
import { suppliersApi } from '../../services/api/suppliers';
import { Supplier } from '../../types';
import { BaseForm } from '../../components/common/BaseForm';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';

interface SupplierFormProps {
  isEditing?: boolean;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ isEditing = false }) => {
  const { id } = useParams();
  const {
    data,
    isLoading,
    handleSubmit,
  } = useForm<Supplier>({
    service: suppliersApi,
    basePath: '/suppliers',
    id
  });

  return (
    <BaseForm
      title={id ? 'Edit Supplier' : 'New Supplier'}
      basePath="/suppliers"
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
            placeholder="Enter supplier name"
          />
        </div>

        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={data.email || ''}
            onChange={handleInputChange}
            required
            placeholder="Enter supplier email"
          />
        </div>

        <div>
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={data.phone || ''}
            onChange={handleInputChange}
            required
            placeholder="Enter supplier phone"
          />
        </div>

        <div>
          <Input
            label="Address"
            name="address"
            value={data.address || ''}
            onChange={handleInputChange}
            placeholder="Enter supplier address"
          />
        </div>

        <div>
          <TextArea
            label="Description"
            name="description"
            value={data.description || ''}
            onChange={handleInputChange}
            placeholder="Enter supplier description"
            rows={4}
          />
        </div>
      </div>
    </BaseForm>
  );
};

export default SupplierForm;