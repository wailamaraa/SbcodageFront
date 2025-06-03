import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, Plus, X, User, Package, Wrench, FileText } from 'lucide-react';
import { reparationsApi } from '../../services/api/reparations';
import { carsApi } from '../../services/api/cars';
import { servicesApi } from '../../services/api/services';
import { inventoryApi } from '../../services/api/inventory';
import { Reparation, Car as CarType, Service, Item } from '../../types';
import { BaseForm } from '../../components/common/BaseForm';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
  status?: number; // Add status code to the interface
}

const DEFAULT_FORM_DATA: Partial<Reparation> = {
  car: '',
  description: '',
  technician: '',
  laborCost: 0,
  items: [],
  services: [],
  notes: '',
  status: 'pending',
  totalCost: 0,
  partsCost: 0,
  servicesCost: 0,
  startDate: new Date().toISOString()
};

const ReparationForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Reparation>>(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleInputChange: useFormHandleInputChange,
  } = useForm<Reparation>({
    service: reparationsApi,
    basePath: '/reparations',
    id: undefined, // Remove id from useForm
    initialData: DEFAULT_FORM_DATA
  });

  // Fetch reparation data when editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      reparationsApi.getById(id).then((response: any) => { // Type as any temporarily to handle direct response
        console.log('API Response for getById:', response);
        // Check if response exists and has required fields
        if (response && response._id) {
          setFormData(response as Partial<Reparation>);
        } else {
          console.error('Failed to fetch reparation data:', response);
          toast.error('Failed to load reparation data');
          navigate('/reparations');
        }
      }).catch(error => {
        console.error('Error fetching reparation data:', error);
        toast.error('Failed to load reparation data');
        navigate('/reparations');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [id, navigate]);

  // Fetch form options (cars, services, items)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, servicesRes, itemsRes] = await Promise.all([
          carsApi.getAll(),
          servicesApi.getAll(),
          inventoryApi.getAll()
        ]);

        console.log('API Responses:', { carsRes, servicesRes, itemsRes });

        // Handle direct response format for cars
        if (Array.isArray(carsRes)) {
          setCars(carsRes as CarType[]);
        } else if (carsRes.success && carsRes.data) {
          setCars(carsRes.data as CarType[]);
        }

        // Handle direct response format for services
        if (Array.isArray(servicesRes)) {
          setServices(servicesRes as Service[]);
        } else if (servicesRes.success && servicesRes.data) {
          setServices(servicesRes.data as Service[]);
        }

        // Handle direct response format for items
        if (Array.isArray(itemsRes)) {
          setItems(itemsRes as Item[]);
        } else if (itemsRes.success && itemsRes.data) {
          setItems(itemsRes.data as Item[]);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast.error('Failed to load form options');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddItem = () => {
    handleChange('items', [...(formData.items || []), { item: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...(formData.items || [])];
    newItems.splice(index, 1);
    handleChange('items', newItems);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
  };

  const handleAddService = () => {
    handleChange('services', [...(formData.services || []), { service: '', notes: '' }]);
  };

  const handleRemoveService = (index: number) => {
    const newServices = [...(formData.services || [])];
    newServices.splice(index, 1);
    handleChange('services', newServices);
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const newServices = [...(formData.services || [])];
    newServices[index] = { ...newServices[index], [field]: value };
    handleChange('services', newServices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) {
      toast.error('Please wait while we process your request...', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting form data:', formData);

    try {
      let response;
      if (id) {
        // For update, we need to send a PUT request to /api/reparations/:id/full
        console.log(`Updating reparation with id: ${id}`, formData);

        // Show loading toast
        const loadingToast = toast.loading('Updating reparation...', {
          position: 'top-center',
          style: {
            background: '#3B82F6',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
        });

        // Prepare the full update data according to API spec
        const updateData = {
          description: formData.description,
          technician: formData.technician,
          laborCost: formData.laborCost,
          status: formData.status,
          notes: formData.notes,
          items: formData.items?.map(item => ({
            item: typeof item.item === 'string' ? item.item : item.item?._id || '',
            quantity: item.quantity
          })) || [],
          services: formData.services?.map(service => ({
            service: typeof service.service === 'string' ? service.service : service.service?._id || '',
            notes: service.notes
          })) || []
        };

        console.log('Full update data prepared:', updateData);
        response = await reparationsApi.updateFull(id, updateData);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Check response status code
        if (response?.status === 200 || response?.status === 201) {
          toast.success(
            'Reparation updated successfully!',
            {
              duration: 3000,
              position: 'top-center',
              style: {
                background: '#10B981',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
              },
              icon: '✅',
            }
          );

          // Add a small delay before navigation to ensure the toast is visible
          setTimeout(() => {
            navigate('/reparations');
          }, 1000);
          return;
        }
      } else {
        // For create, we need to send a POST request to /api/reparations
        console.log('Creating new reparation:', formData);

        // Show loading toast
        const loadingToast = toast.loading('Creating new reparation...', {
          position: 'top-center',
          style: {
            background: '#3B82F6',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
        });

        const createData = {
          car: typeof formData.car === 'string' ? formData.car : formData.car?._id,
          description: formData.description,
          technician: formData.technician,
          laborCost: formData.laborCost,
          items: formData.items?.map(item => ({
            item: typeof item.item === 'string' ? item.item : item.item?._id,
            quantity: item.quantity
          })) || [],
          services: formData.services?.map(service => ({
            service: typeof service.service === 'string' ? service.service : service.service?._id,
            notes: service.notes
          })) || [],
          notes: formData.notes,
          status: formData.status,
          startDate: formData.startDate
        };
        console.log('Create data prepared:', createData);
        response = await reparationsApi.create(createData as Reparation);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Check response status code
        if (response?.status === 200 || response?.status === 201) {
          toast.success(
            'New reparation created successfully!',
            {
              duration: 3000,
              position: 'top-center',
              style: {
                background: '#10B981',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
              },
              icon: '✅',
            }
          );

          // Add a small delay before navigation to ensure the toast is visible
          setTimeout(() => {
            navigate('/reparations');
          }, 1000);
          return;
        }
      }

      // Handle error cases with better error messages
      if (response?.status === 400) {
        // Validation errors
        if (response?.errors && Array.isArray(response.errors)) {
          response.errors.forEach((error: any) =>
            toast.error(`${error.field}: ${error.message}`, {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#EF4444',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
              },
              icon: '❌',
            })
          );
        } else {
          toast.error('Invalid data provided. Please check your inputs.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
        }
      } else if (response?.status === 401) {
        toast.error('You are not authorized to perform this action. Please log in again.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (response?.status === 403) {
        toast.error('You do not have permission to perform this action.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
      } else if (response?.status === 404) {
        toast.error('The requested resource was not found.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
      } else if (response?.status === 500) {
        toast.error('An internal server error occurred. Please try again later.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
      } else {
        toast.error(
          response?.message || `Failed to ${id ? 'update' : 'create'} reparation.`,
          {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          }
        );
      }
    } catch (error: any) {
      console.error('Error during form submission:', error);

      // Handle network errors
      if (!error.response) {
        toast.error('Network error. Please check your internet connection.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
        return;
      }

      // Handle specific error status codes
      const status = error.response?.status;
      if (status === 401) {
        toast.error('Your session has expired. Please log in again.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
      } else if (status === 404) {
        toast.error('The requested resource was not found.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
      } else if (status === 500) {
        toast.error('An internal server error occurred. Please try again later.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          icon: '❌',
        });
      } else {
        toast.error(
          error.response?.data?.message || `An error occurred while ${id ? 'updating' : 'creating'} the reparation.`,
          {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this reparation? This will return all items to stock.')) {
      try {
        setIsSubmitting(true);

        // Show loading toast
        const loadingToast = toast.loading('Deleting reparation...', {
          position: 'top-center',
          style: {
            background: '#3B82F6',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
        });

        const response = await reparationsApi.delete(id);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Check response status code
        if (response?.status === 200 || response?.status === 204) {
          toast.success('Reparation deleted successfully', {
            duration: 3000,
            position: 'top-center',
            style: {
              background: '#10B981',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '✅',
          });

          // Add a small delay before navigation
          setTimeout(() => {
            navigate('/reparations');
          }, 1000);
        } else if (response?.status === 401) {
          toast.error('Your session has expired. Please log in again.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (response?.status === 403) {
          toast.error('You do not have permission to delete this reparation.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
        } else if (response?.status === 404) {
          toast.error('The reparation was not found.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
        } else {
          toast.error(response?.message || 'Failed to delete reparation', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
        }
      } catch (error: any) {
        console.error('Error deleting reparation:', error);

        // Handle network errors
        if (!error.response) {
          toast.error('Network error. Please check your internet connection.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
          return;
        }

        // Handle specific error status codes
        const status = error.response?.status;
        if (status === 401) {
          toast.error('Your session has expired. Please log in again.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (status === 403) {
          toast.error('You do not have permission to delete this reparation.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
        } else if (status === 404) {
          toast.error('The reparation was not found.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
        } else if (status === 500) {
          toast.error('An internal server error occurred. Please try again later.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
        } else {
          toast.error('An error occurred while deleting the reparation', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            icon: '❌',
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatCarOption = (car: CarType) => {
    const ownerInfo = car.owner ? `Owner: ${car.owner.name}${car.owner.phone ? ` (${car.owner.phone})` : ''}` : 'No owner';
    return {
      value: car._id,
      label: `${car.make} ${car.model} (${car.year}) - ${car.licensePlate} - ${ownerInfo}`
    };
  };

  const formatItemOption = (item: Item) => ({
    value: item._id,
    label: `${item.name} - ${formatCurrency(item.price)} (${item.quantity} in stock)`
  });

  const formatServiceOption = (service: Service) => ({
    value: service._id,
    label: `${service.name} - ${formatCurrency(service.price)} (${service.duration}h)`
  });

  return (
    <BaseForm
      title={id ? 'Edit Reparation' : 'New Reparation'}
      basePath="/reparations"
      isLoading={loading || isSubmitting}
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        {/* Vehicle Selection */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Car size={20} className="text-gray-400" />
            <h3 className="text-lg font-medium">Vehicle Information</h3>
          </div>
          <Select
            label="Select Vehicle"
            name="car"
            value={typeof formData.car === 'string' ? formData.car : formData.car?._id || ''}
            onChange={handleInputChange}
            required
            options={cars.map(formatCarOption)}
            className="w-full"
          />
        </div>

        {/* Basic Information */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-gray-400" />
            <h3 className="text-lg font-medium">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Technician"
              name="technician"
              value={formData.technician}
              onChange={handleInputChange}
              required
              placeholder="Enter technician name"
            />

            <Input
              label="Labor Cost"
              name="laborCost"
              type="number"
              value={formData.laborCost}
              onChange={handleInputChange}
              required
              min={0}
              step={0.01}
              placeholder="Enter labor cost"
            />
          </div>

          <div className="mt-4">
            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter repair description"
              rows={3}
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium">Parts & Items</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
            >
              <Plus size={16} className="mr-2" />
              Add Item
            </Button>
          </div>
          <div className="space-y-4">
            {(formData.items || []).map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-white dark:bg-gray-700 p-4 rounded-md">
                <div className="flex-grow">
                  <Select
                    label="Item"
                    value={typeof item.item === 'string' ? item.item : item.item?._id || ''}
                    onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                    required
                    options={items.map(formatItemOption)}
                  />
                </div>
                <div className="w-32">
                  <Input
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    required
                    min={1}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  className="mt-8"
                >
                  <X size={16} className="text-gray-400" />
                </Button>
              </div>
            ))}
            {(formData.items || []).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No items added. Click "Add Item" to start adding parts.
              </div>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Wrench size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium">Services</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddService}
            >
              <Plus size={16} className="mr-2" />
              Add Service
            </Button>
          </div>
          <div className="space-y-4">
            {(formData.services || []).map((service, index) => (
              <div key={index} className="flex gap-4 items-start bg-white dark:bg-gray-700 p-4 rounded-md">
                <div className="flex-grow">
                  <Select
                    label="Service"
                    value={typeof service.service === 'string' ? service.service : service.service?._id || ''}
                    onChange={(e) => handleServiceChange(index, 'service', e.target.value)}
                    required
                    options={services.map(formatServiceOption)}
                  />
                </div>
                <div className="flex-grow">
                  <Input
                    label="Notes"
                    value={service.notes}
                    onChange={(e) => handleServiceChange(index, 'notes', e.target.value)}
                    placeholder="Service notes (optional)"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveService(index)}
                  className="mt-8"
                >
                  <X size={16} className="text-gray-400" />
                </Button>
              </div>
            ))}
            {(formData.services || []).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No services added. Click "Add Service" to start adding services.
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-gray-400" />
            <h3 className="text-lg font-medium">Additional Information</h3>
          </div>
          <div className="space-y-4">
            <TextArea
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter any additional notes"
              rows={3}
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
            />
          </div>
        </div>
      </div>
    </BaseForm>
  );
};

export default ReparationForm; 