import React from 'react';
import { useParams } from 'react-router-dom';
import { Car as CarIcon, User, Calendar, FileText, Clock } from 'lucide-react';
import { carsApi } from '../../services/api/cars';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';

const CarDetails: React.FC = () => {
  const { id = '' } = useParams();
  const { data: car, isLoading, handleDelete } = useDetails({
    service: carsApi,
    basePath: '/vehicles',
    id
  });

  if (!car && !isLoading) {
    return null;
  }

  return (
    <BaseDetails
      title={`${car?.make} ${car?.model} (${car?.year})`}
      basePath="/vehicles"
      data={car!}
      isLoading={isLoading}
      onDelete={handleDelete}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CarIcon size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Vehicle Info</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Make:</span> {car?.make}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Model:</span> {car?.model}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Year:</span> {car?.year}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">License Plate:</span> {car?.licensePlate}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">VIN:</span> {car?.vin || 'N/A'}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Status:</span>{' '}
              <Badge variant={car?.status === 'active' ? 'success' : 'gray'}>
                {(car?.status || 'inactive').charAt(0).toUpperCase() + (car?.status || 'inactive').slice(1)}
              </Badge>
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner Information</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Name:</span> {car?.owner?.name}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Email:</span> {car?.owner?.email}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Phone:</span> {car?.owner?.phone || 'N/A'}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Service History</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Last Service:</span>{' '}
              {car?.lastService ? new Date(car.lastService).toLocaleDateString() : 'Never'}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Next Service Due:</span>{' '}
              {car?.nextService ? new Date(car.nextService).toLocaleDateString() : 'Not scheduled'}
            </p>
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamps</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Created:</span>{' '}
              {car?.createdAt ? new Date(car.createdAt).toLocaleString() : '-'}
            </p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">Last Updated:</span>{' '}
              {car?.updatedAt ? new Date(car.updatedAt).toLocaleString() : '-'}
            </p>
          </div>
        </div>
      </div>
    </BaseDetails>
  );
};

export default CarDetails; 