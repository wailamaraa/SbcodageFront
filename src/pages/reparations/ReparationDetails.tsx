import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Car, User, DollarSign, Clock, FileText, Package, Wrench, PlayCircle, CheckCircle } from 'lucide-react';
import { reparationsApi } from '../../services/api/reparations';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';
import Badge, { BadgeVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const ReparationDetails: React.FC = () => {
  const { id = '' } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: reparation, isLoading, handleDelete, refresh } = useDetails({
    service: reparationsApi,
    basePath: '/reparations',
    id
  });

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
    if (!reparation || reparation.status === 'completed' || reparation.status === 'cancelled') {
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

  const statusMap: Record<string, BadgeVariant> = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'danger'
  };

  const statusVariant = statusMap[reparation?.status || 'pending'];

  const statusText = (reparation?.status || 'pending')
    .replace('_', ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
                <Badge variant={statusVariant} className="mt-1">
                  {statusText}
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
                return (
                  <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {itemEntry.quantity}</p>
                    </div>
                    <p className="font-medium">${itemEntry.price?.toFixed(2) || '0.00'}</p>
                  </div>
                );
              })}
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="font-medium">Total Parts Cost</p>
                <p className="font-medium">${reparation.partsCost?.toFixed(2) || '0.00'}</p>
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
                    <p className="font-medium">${serviceEntry.price?.toFixed(2) || '0.00'}</p>
                  </div>
                );
              })}
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="font-medium">Total Services Cost</p>
                <p className="font-medium">${reparation.servicesCost?.toFixed(2) || '0.00'}</p>
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
              <p>Parts Cost</p>
              <p className="font-medium">${reparation?.partsCost?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Services Cost</p>
              <p className="font-medium">${reparation?.servicesCost?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Labor Cost</p>
              <p className="font-medium">${reparation?.laborCost?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <p className="font-medium">Total Cost</p>
              <p className="font-medium text-lg">${reparation?.totalCost?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

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