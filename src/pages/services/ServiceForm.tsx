import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesApi } from '../../services/api/services';
import { Service } from '../../types';
import { BaseForm } from '../../components/common/BaseForm';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import { toast } from 'react-hot-toast';

const DEFAULT_FORM_DATA: Partial<Service> = {
  name: '',
  description: '',
  price: 0,
  duration: 1,
  category: 'maintenance',
  status: 'active'
};

const ServiceForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log('ServiceForm rendered with id:', id);

  const [formData, setFormData] = useState<Partial<Service>>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleInputChange: useFormHandleInputChange,
  } = useForm<Service>({
    service: servicesApi,
    basePath: '/services',
    id: undefined,
    initialData: DEFAULT_FORM_DATA
  });

  console.log('useForm hook initialized (for input change handling).');

  useEffect(() => {
    console.log('useEffect triggered for fetching data. id:', id);
    if (id) {
      setIsLoading(true);
      console.log('Fetching service data for editing...');
      servicesApi.getById(id).then(response => {
        console.log('API Response for getById:', response);
        if (response) {
          console.log('Setting form data with fetched response...');
          setFormData(response);
          console.log('Form data set.');
        } else {
          console.error('Failed to fetch service data: No response data');
          toast.error('Failed to load service data');
          navigate('/services');
        }
      }).catch(error => {
        console.error('Error fetching service data:', error);
        toast.error('Failed to load service data');
        navigate('/services');
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting form data:', formData);

    try {
      let response;
      if (id) {
        console.log(`Updating service with id: ${id}`, formData);
        response = await servicesApi.update(id, formData as Service);
      } else {
        console.log('Creating new service:', formData);
        response = await servicesApi.create(formData as Service);
      }

      console.log('API Response for submission:', response);

      if (response && !response.errors) {
        toast.success(`Service ${id ? 'updated' : 'created'} successfully!`);
        navigate('/services');
      } else {
        console.error(`Failed to ${id ? 'update' : 'create'} service:`, response?.message || response?.errors);
        if (response?.errors && Array.isArray(response.errors)) {
          response.errors.forEach((error: any) => toast.error(`${error.field}: ${error.message}`));
        } else {
          toast.error(response?.message || `Failed to ${id ? 'update' : 'create'} service.`);
        }
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error(`An error occurred while ${id ? 'updating' : 'creating'} the service.`);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Current form data state (manual):', formData);

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
            value={formData.name || ''}
            onChange={handleInputChange}
            required
            placeholder="Enter service name"
          />
        </div>

        <div>
          <TextArea
            label="Description"
            name="description"
            value={formData.description || ''}
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
              value={formData.price || ''}
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
              value={formData.duration || ''}
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
              value={formData.category || ''}
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
              value={formData.status || ''}
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