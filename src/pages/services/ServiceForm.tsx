import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesApi } from '../../services/api/services';
import { Service } from '../../types';
import { BaseForm } from '../../components/common/BaseForm';
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
  const [formData, setFormData] = useState<Partial<Service>>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  console.log('ServiceForm rendered with id:', id);

  useEffect(() => {
    console.log('useEffect triggered for fetching data. id:', id);
    if (id) {
      setIsLoading(true);
      console.log('Fetching service data for editing...');
      servicesApi.getById(id).then(response => {
        console.log('API Response for getById:', response);
        if (response && response.success && response.data) {
          console.log('Setting form data with fetched response...');
          setFormData(response.data);
          console.log('Form data set.');
        } else {
          console.error('Failed to fetch service data: No response data');
          toast.error('Échec du chargement des données du service');
          navigate('/services');
        }
      }).catch(error => {
        console.error('Error fetching service data:', error);
        toast.error('Échec du chargement des données du service');
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
    setFormData((prev: Partial<Service>) => ({
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
        toast.success(`Service ${id ? 'mis à jour' : 'créé'} avec succès !`);
        navigate('/services');
      } else {
        console.error(`Failed to ${id ? 'update' : 'create'} service:`, response?.message || response?.errors);
        if (response?.errors && Array.isArray(response.errors)) {
          response.errors.forEach((error: any) => toast.error(`${error.field}: ${error.message}`));
        } else {
          toast.error(response?.message || `Échec de ${id ? 'la mise à jour' : 'la création'} du service.`);
        }
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error(`Une erreur s'est produite lors de ${id ? 'la mise à jour' : 'la création'} du service.`);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Current form data state (manual):', formData);

  return (
    <BaseForm
      title={id ? 'Modifier le Service' : 'Nouveau Service'}
      basePath="/services"
      isLoading={isLoading}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <Input
            label="Nom"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
            placeholder="Entrez le nom du service"
          />
        </div>

        <div>
          <TextArea
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Entrez la description du service"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Prix"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleInputChange}
              required
              placeholder="Entrez le prix du service"
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <Input
              label="Durée (heures)"
              name="duration"
              type="number"
              value={formData.duration || ''}
              onChange={handleInputChange}
              required
              placeholder="Entrez la durée du service"
              min={0}
              step={0.5}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Catégorie"
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              required
              options={[
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'repair', label: 'Réparation' },
                { value: 'diagnostic', label: 'Diagnostic' },
                { value: 'bodywork', label: 'Carrosserie' },
                { value: 'other', label: 'Autre' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Statut"
              name="status"
              value={formData.status || ''}
              onChange={handleInputChange}
              required
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' }
              ]}
            />
          </div>
        </div>
      </div>
    </BaseForm>
  );
};

export default ServiceForm; 