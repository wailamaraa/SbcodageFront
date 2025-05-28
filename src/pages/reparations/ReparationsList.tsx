import React from 'react';
import { Car, User, DollarSign, Clock } from 'lucide-react';
import { reparationsApi } from '../../services/api/reparations';
import { Reparation } from '../../types';
import { BaseList } from '../../components/common/BaseList';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

const ReparationsList: React.FC = () => {
  const columns = [
    {
      header: 'Vehicle',
      accessor: (reparation: Reparation) => {
        if (!reparation.car) {
          return (
            <div className="flex items-center gap-2">
              <Car size={16} className="text-gray-400" />
              <div className="font-medium">N/A</div>
            </div>
          );
        }

        const car = typeof reparation.car === 'string'
          ? { make: 'Unknown', model: 'Unknown', year: 'N/A', owner: { name: 'Unknown' } }
          : reparation.car;

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Car size={16} className="text-gray-400" />
              <div className="font-medium">{car.make} {car.model} ({car.year})</div>
            </div>
            <div className="text-sm text-gray-500 ml-6">
              Owner: {car.owner?.name || 'N/A'}
            </div>
          </div>
        );
      },
      className: 'min-w-[250px]'
    },
    {
      header: 'Technician',
      accessor: (reparation: Reparation) => {
        if (!reparation.technician) {
          return (
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span>N/A</span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <span>{reparation.technician}</span>
          </div>
        );
      },
      className: 'min-w-[150px]'
    },
    {
      header: 'Status',
      accessor: (reparation: Reparation) => {
        const statusVariants = {
          pending: 'warning',
          in_progress: 'info',
          completed: 'success',
          cancelled: 'danger'
        } as const;

        const status = reparation.status || 'pending';
        const statusText = status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

        return (
          <Badge variant={statusVariants[status]}>
            {statusText}
          </Badge>
        );
      },
      className: 'min-w-[120px]'
    },
    {
      header: 'Total Cost',
      accessor: (reparation: Reparation) => (
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-400" />
          <span>{formatCurrency(reparation.totalCost || 0)}</span>
        </div>
      ),
      className: 'min-w-[120px]'
    },
    {
      header: 'Created At',
      accessor: (reparation: Reparation) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span>{reparation.createdAt ? new Date(reparation.createdAt).toLocaleDateString() : 'N/A'}</span>
        </div>
      ),
      className: 'min-w-[150px]'
    }
  ];

  return (
    <BaseList<Reparation>
      title="Reparations"
      basePath="/reparations"
      service={reparationsApi}
      columns={columns}
      sortOptions={[
        { value: '-createdAt', label: 'Newest First' },
        { value: 'createdAt', label: 'Oldest First' },
        { value: 'totalCost', label: 'Cost Low to High' },
        { value: '-totalCost', label: 'Cost High to Low' },
        { value: 'status', label: 'Status A-Z' },
        { value: '-status', label: 'Status Z-A' },
      ]}
      searchPlaceholder="Search reparations..."
      createButtonLabel="New Reparation"
      emptyMessage="No reparations found"
    />
  );
};

export default ReparationsList; 