import React from 'react';
import { Car as CarIcon, Calendar, User, FileText } from 'lucide-react';
import { carsApi } from '../../services/api/cars';
import { BaseList } from '../../components/common/BaseList';
import Badge from '../../components/ui/Badge';
import { Car } from '../../types';

const CarsList: React.FC = () => {
  const columns = [
    {
      header: 'Make & Model',
      accessor: (car: Car) => (
        <div className="flex items-center">
          <CarIcon size={20} className="text-gray-400 mr-2" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {car.make} {car.model}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {car.year}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'License Plate',
      accessor: (car: Car) => (
        <div className="flex items-center">
          <FileText size={20} className="text-gray-400 mr-2" />
          <span className="font-medium">{car.licensePlate}</span>
        </div>
      ),
    },
    {
      header: 'Owner',
      accessor: (car: Car) => {
        const ownerName = car.owner?.name || 'N/A';
        const ownerEmail = car.owner?.email || 'N/A';
        
        return (
          <div className="flex items-center">
            <User size={20} className="text-gray-400 mr-2" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {ownerName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {ownerEmail}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: (car: Car) => {
        const status = car.status || 'inactive';
        return (
          <Badge variant={status === 'active' ? 'success' : 'gray'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      header: 'Last Service',
      accessor: (car: Car) => (
        <div className="flex items-center">
          <Calendar size={20} className="text-gray-400 mr-2" />
          <span>{car.lastService ? new Date(car.lastService).toLocaleDateString() : 'Never'}</span>
        </div>
      ),
    },
  ];

  return (
    <BaseList
      title="Vehicles"
      basePath="/vehicles"
      service={carsApi}
      columns={columns}
      sortOptions={[
        { value: '-createdAt', label: 'Newest First' },
        { value: 'createdAt', label: 'Oldest First' },
        { value: 'make', label: 'Make (A-Z)' },
        { value: '-make', label: 'Make (Z-A)' },
      ]}
      searchPlaceholder="Search vehicles..."
      createButtonLabel="New Vehicle"
      emptyMessage="No vehicles found"
    />
  );
};

export default CarsList; 