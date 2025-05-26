import React from 'react';
import { useParams } from 'react-router-dom';
import { Wrench, Clock, DollarSign, Tag, FileText } from 'lucide-react';
import { servicesApi } from '../../services/api/services';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';

const ServiceDetails: React.FC = () => {
  const { id = '' } = useParams();
  const { data: service, isLoading, handleDelete } = useDetails({
    service: servicesApi,
    basePath: '/services',
    id
  });

  // Add console.log to help debug
  console.log('Service Details State:', { service, isLoading, id });

  if (!service && !isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-gray-500 dark:text-gray-400">Service not found</p>
      </div>
    );
  }

  return (
    <BaseDetails
      title={service?.name || 'Service Details'}
      basePath="/services"
      data={service!}
      isLoading={isLoading}
      onDelete={handleDelete}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
          </div>
          <p className="text-gray-900 dark:text-white">{service?.name}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</h3>
          </div>
          <p className="text-gray-900 dark:text-white">${service?.price?.toFixed(2)}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {service?.duration} hour{service?.duration !== 1 ? 's' : ''}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
          </div>
          <Badge variant="gray">
            {service?.category ? service.category.charAt(0).toUpperCase() + service.category.slice(1) : '-'}
          </Badge>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
          </div>
          <Badge variant={service?.status ? (service.status === 'active' ? 'success' : 'gray') : 'gray'}>
            {service?.status ? service.status.charAt(0).toUpperCase() + service.status.slice(1) : 'Inactive'}
          </Badge>
        </div>

        {service?.description && (
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
            </div>
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{service.description}</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {service?.createdAt ? new Date(service.createdAt).toLocaleString() : '-'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {service?.updatedAt ? new Date(service.updatedAt).toLocaleString() : '-'}
          </p>
        </div>
      </div>
    </BaseDetails>
  );
};

export default ServiceDetails; 