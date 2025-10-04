import React from 'react';
import { Car, User, DollarSign, Clock, TrendingUp } from 'lucide-react';
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

        const statusLabels = {
          pending: 'Pending',
          in_progress: 'Working',
          completed: 'Finished',
          cancelled: 'Cancelled'
        } as const;

        const status = reparation.status || 'pending';

        return (
          <Badge variant={statusVariants[status]}>
            {statusLabels[status] || status}
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
      header: 'Profit',
      accessor: (reparation: Reparation) => {
        if (!reparation.totalProfit || reparation.totalProfit <= 0) {
          return <span className="text-gray-400 text-sm">-</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {formatCurrency(reparation.totalProfit)}
            </span>
          </div>
        );
      },
      className: 'min-w-[100px]'
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