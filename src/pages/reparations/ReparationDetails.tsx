import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Car, DollarSign, Clock, FileText, Package, Wrench, PlayCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { reparationsApi } from '../../services/api/reparations';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';
import Badge, { BadgeVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';

const ReparationDetails: React.FC = () => {
  const { id = '' } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: reparation, isLoading, handleDelete, refresh } = useDetails({
    service: reparationsApi,
    basePath: '/reparations',
    id
  });

  const statusMap: Record<string, BadgeVariant> = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'danger'
  };

  const handleStatusUpdate = async () => {
    if (!reparation || isUpdating) return;

    setIsUpdating(true);
    try {
      let newStatus: 'pending' | 'in_progress' | 'completed';
      switch (reparation.status) {
        case 'pending':
          newStatus = 'in_progress';
          break;
        case 'in_progress':
          newStatus = 'completed';
          break;
        default:
          setIsUpdating(false);
          return; // Don't update if already completed
      }

      await reparationsApi.updateStatus(id, newStatus);
      await refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusButton = () => {
    if (!reparation) return null;

    if (reparation.status === 'completed' || reparation.status === 'cancelled') {
      return null;
    }

    const isInProgress = reparation.status === 'in_progress';
    return (
      <Button
        variant="primary"
        onClick={handleStatusUpdate}
        disabled={isUpdating}
        className="flex items-center gap-2"
      >
        {isInProgress ? <CheckCircle size={20} /> : <PlayCircle size={20} />}
        {isInProgress ? 'Mark as Completed' : 'Start Repair'}
      </Button>
    );
  };

  if (!reparation && !isLoading) {
    return null;
  }

  const car = typeof reparation?.car === 'string'
    ? { make: '', model: '', year: '', licensePlate: '', owner: { name: '', email: '', phone: '' } }
    : reparation?.car;

  // Get the reparation status from the data field
  const reparationStatus = (reparation as any)?.data?.status || reparation?.status || 'pending';
  
  // Format status for display
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pending',
      'in_progress': 'Working',
      'completed': 'Finished',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  };

  return (
    <BaseDetails
      title="Reparation Details"
      basePath="/reparations"
      data={reparation!}
      isLoading={isLoading}
      onDelete={handleDelete}
      extraActions={getStatusButton()}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Car size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium">Vehicle Information</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Make & Model</p>
                <p className="font-medium">{car?.make} {car?.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">License Plate</p>
                <p className="font-medium">{car?.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                <p className="font-medium">{car?.owner?.name}</p>
                <p className="text-sm text-gray-500">{car?.owner?.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium">Repair Details</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant={statusMap[reparationStatus]} className="mt-1">
                  {getStatusLabel(reparationStatus)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                <p className="font-medium">{reparation?.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Technician</p>
                <p className="font-medium">{reparation?.technician}</p>
              </div>
            </div>
          </div>
        </div>

        {reparation?.items && reparation.items.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium">Parts & Items</h3>
            </div>
            <div className="space-y-2">
              {reparation.items.map((itemEntry, index) => {
                const item = typeof itemEntry.item === 'string'
                  ? { name: itemEntry.item }
                  : itemEntry.item;
                const buyPrice = itemEntry.buyPrice || 0;
                const sellPrice = itemEntry.sellPrice || itemEntry.price || 0;
                const totalPrice = itemEntry.totalPrice || (sellPrice * itemEntry.quantity);
                const itemProfit = (sellPrice - buyPrice) * itemEntry.quantity;
                
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>Qty: {itemEntry.quantity}</span>
                          <span>Buy: {formatCurrency(buyPrice)}</span>
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            Sell: {formatCurrency(sellPrice)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(totalPrice)}</p>
                        {itemProfit > 0 && (
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            +{formatCurrency(itemProfit)} profit
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="font-medium">Total Parts Cost</p>
                <p className="font-medium">{formatCurrency(reparation.partsCost || 0)}</p>
              </div>
            </div>
          </div>
        )}

        {reparation?.services && reparation.services.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Wrench size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium">Services</h3>
            </div>
            <div className="space-y-2">
              {reparation.services.map((serviceEntry, index) => {
                const service = typeof serviceEntry.service === 'string'
                  ? { name: serviceEntry.service }
                  : serviceEntry.service;
                return (
                  <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      {serviceEntry.notes && (
                        <p className="text-sm text-gray-500">{serviceEntry.notes}</p>
                      )}
                    </div>
                    <p className="font-medium">{formatCurrency(serviceEntry.price || 0)}</p>
                  </div>
                );
              })}
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="font-medium">Total Services Cost</p>
                <p className="font-medium">{formatCurrency(reparation.servicesCost || 0)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={20} className="text-gray-400" />
            <h3 className="text-lg font-medium">Cost Summary</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p>Parts Cost (to client)</p>
              <p className="font-medium">{formatCurrency(reparation?.partsCost || 0)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Services Cost</p>
              <p className="font-medium">{formatCurrency(reparation?.servicesCost || 0)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Labor Cost</p>
              <p className="font-medium">{formatCurrency(reparation?.laborCost || 0)}</p>
            </div>
            {reparation?.totalProfit !== undefined && reparation.totalProfit > 0 && (
              <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                <p className="font-medium">Parts Profit</p>
                <p className="font-bold">+{formatCurrency(reparation.totalProfit)}</p>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-600">
              <p className="font-bold text-lg">Total Revenue</p>
              <p className="font-bold text-xl text-green-600 dark:text-green-400">{formatCurrency(reparation?.totalCost || 0)}</p>
            </div>
          </div>
        </div>

        {reparation?.totalProfit !== undefined && reparation.totalProfit > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg shadow border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">Profit Analysis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Parts Profit</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(reparation.totalProfit)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  From {reparation.items?.length || 0} items
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Parts Cost</p>
                <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  {formatCurrency(reparation.partsCost || 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Charged to client
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Profit Margin</p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {reparation.partsCost && reparation.partsCost > reparation.totalProfit ? ((reparation.totalProfit / (reparation.partsCost - reparation.totalProfit)) * 100).toFixed(1) : '0'}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  On parts sold
                </p>
              </div>
            </div>
          </div>
        )}

        {reparation?.notes && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium">Additional Notes</h3>
            </div>
            <p className="whitespace-pre-wrap">{reparation.notes}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-gray-400" />
            <h3 className="text-lg font-medium">Timeline</h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
              <p className="font-medium">{new Date(reparation?.startDate || '').toLocaleString()}</p>
            </div>
            {reparation?.endDate && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                <p className="font-medium">{new Date(reparation.endDate).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseDetails>
  );
};

export default ReparationDetails; 