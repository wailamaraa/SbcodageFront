import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const [cars, setCars] = useState<CarType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    data,
    isLoading,
    handleSubmit,
    handleInputChange,
    handleChange
  } = useForm<Reparation>({
    service: reparationsApi,
    basePath: '/reparations',
    id,
    initialData: DEFAULT_FORM_DATA
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, servicesRes, itemsRes] = await Promise.all([
          carsApi.getAll(),
          servicesApi.getAll(),
          inventoryApi.getAll()
        ]);

        if (carsRes.success && carsRes.data) setCars(carsRes.data);
        if (servicesRes.success && servicesRes.data) setServices(servicesRes.data);
        if (itemsRes.success && itemsRes.data) setItems(itemsRes.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    handleChange('items', [...data.items, { item: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...data.items];
    newItems.splice(index, 1);
    handleChange('items', newItems);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
  };

  const handleAddService = () => {
    handleChange('services', [...data.services, { service: '', notes: '' }]);
  };

  const handleRemoveService = (index: number) => {
    const newServices = [...data.services];
    newServices.splice(index, 1);
    handleChange('services', newServices);
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const newServices = [...data.services];
    newServices[index] = { ...newServices[index], [field]: value };
    handleChange('services', newServices);
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
    label: `${item.name} - $${item.price.toFixed(2)} (${item.quantity} in stock)`
  });

  const formatServiceOption = (service: Service) => ({
    value: service._id,
    label: `${service.name} - $${service.price.toFixed(2)} (${service.duration}h)`
  });

  // Helper function to find the selected item/service name
  const getSelectedItemName = (id: string) => {
    const item = items.find(i => i._id === id);
    return item ? formatItemOption(item).label : id;
  };

  const getSelectedServiceName = (id: string) => {
    const service = services.find(s => s._id === id);
    return service ? formatServiceOption(service).label : id;
  };

  const getSelectedCarName = (id: string) => {
    const car = cars.find(c => c._id === id);
    return car ? formatCarOption(car).label : id;
  };

  return (
    <BaseForm
      title={id ? 'Edit Reparation' : 'New Reparation'}
      basePath="/reparations"
      isLoading={isLoading || loading}
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
            value={typeof data.car === 'string' ? data.car : data.car?._id || ''}
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
              value={data.technician}
            onChange={handleInputChange}
            required
            placeholder="Enter technician name"
          />

            <Input
              label="Labor Cost"
              name="laborCost"
              type="number"
              value={data.laborCost}
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
              value={data.description}
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
            {data.items.map((item, index) => (
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
            {data.items.length === 0 && (
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
            {data.services.map((service, index) => (
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
            {data.services.length === 0 && (
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
              value={data.notes}
              onChange={handleInputChange}
              placeholder="Enter any additional notes"
              rows={3}
            />

            <Select
              label="Status"
              name="status"
              value={data.status}
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