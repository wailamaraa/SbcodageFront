import React from 'react';
import { Wrench, Clock, DollarSign, Tag } from 'lucide-react';
import { servicesApi } from '../../services/api/services';
import { Service } from '../../types';
import { BaseList } from '../../components/common/BaseList';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import ServiceForm from './ServiceForm';

const ServicesList: React.FC = () => {
  const columns = [
    {
      header: 'Name',
      accessor: (service: Service) => (
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-gray-400" />
          <div className="font-medium">{service.name}</div>
        </div>
      ),
      className: 'min-w-[200px]'
    },
    {
      header: 'Price',
      accessor: (service: Service) => (
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-400" />
          <span>{formatCurrency(service.price)}</span>
        </div>
      ),
      className: 'min-w-[120px]'
    },
    {
      header: 'Duration',
      accessor: (service: Service) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span>{service.duration} hour{service.duration !== 1 ? 's' : ''}</span>
        </div>
      ),
      className: 'min-w-[120px]'
    },
    {
      header: 'Category',
      accessor: (service: Service) => (
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-gray-400" />
          <Badge variant="gray">
            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
          </Badge>
        </div>
      ),
      className: 'min-w-[150px]'
    },
    {
      header: 'Status',
      accessor: (service: Service) => (
        <Badge variant={service.status === 'active' ? 'success' : 'gray'}>
          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
        </Badge>
      ),
      className: 'min-w-[100px]'
    }
  ];

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);

  return (
    <>
      <BaseList<Service>
        title="Services"
        basePath="/services"
        service={servicesApi}
        columns={columns}
        sortOptions={[
          { value: '-createdAt', label: 'Newest First' },
          { value: 'createdAt', label: 'Oldest First' },
          { value: 'name', label: 'Name A-Z' },
          { value: '-name', label: 'Name Z-A' },
          { value: 'price', label: 'Price Low to High' },
          { value: '-price', label: 'Price High to Low' },
          { value: 'duration', label: 'Duration Low to High' },
          { value: '-duration', label: 'Duration High to Low' },
        ]}
        searchPlaceholder="Search services..."
        createButtonLabel="New Service"
        emptyMessage="No services found"
      />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <ServiceForm isEditing={!!selectedService} />
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesList; 