import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, DollarSign, Package, Wrench, PlayCircle, CheckCircle, TrendingUp, ArrowLeft, Edit, Trash2, User, FileText, Download } from 'lucide-react';
import { reparationsApi } from '../../services/api/reparations';
import { useDetails } from '../../hooks/useDetails';
import Badge, { BadgeVariant } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';

const ReparationDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
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

  const handleStatusUpdate = async (newStatus: 'in_progress' | 'completed' | 'cancelled') => {
    if (!reparation || isUpdating) return;

    setIsUpdating(true);
    try {
      await reparationsApi.updateStatus(id, newStatus);
      await refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusButtons = () => {
    if (!reparation) return null;

    const currentStatus = reparation.status;
    const buttons = [];

    // Show appropriate buttons based on current status
    if (currentStatus === 'pending') {
      buttons.push(
        <Button
          key="start"
          variant="primary"
          onClick={() => handleStatusUpdate('in_progress')}
          disabled={isUpdating}
          icon={<PlayCircle size={20} />}
        >
          Commencer la Réparation
        </Button>
      );
      buttons.push(
        <Button
          key="cancel"
          variant="outline"
          onClick={() => handleStatusUpdate('cancelled')}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Annuler
        </Button>
      );
    } else if (currentStatus === 'in_progress') {
      buttons.push(
        <Button
          key="complete"
          variant="primary"
          onClick={() => handleStatusUpdate('completed')}
          disabled={isUpdating}
          icon={<CheckCircle size={20} />}
        >
          Marquer comme Terminé
        </Button>
      );
      buttons.push(
        <Button
          key="cancel"
          variant="outline"
          onClick={() => handleStatusUpdate('cancelled')}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Annuler
        </Button>
      );
    }

    return buttons.length > 0 ? <div className="flex gap-2">{buttons}</div> : null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reparation) {
    return (
      <div className="text-center py-8">
        <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Réparation non trouvée</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/reparations')}
          icon={<ArrowLeft size={20} />}
        >
          Retour aux Réparations
        </Button>
      </div>
    );
  }

  const car = typeof reparation?.car === 'string'
    ? { make: '', model: '', year: '', licensePlate: '', owner: { name: '', email: '', phone: '' } }
    : reparation?.car;

  // Get the reparation status from the reparation object
  // Handle case where status might be a number (HTTP status) by ensuring it's a string
  let reparationStatus = reparation?.status || 'pending';
  if (typeof reparationStatus === 'number') {
    console.warn('Status is a number (likely HTTP status), defaulting to pending:', reparationStatus);
    reparationStatus = 'pending';
  }
  
  // Format status for display
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'En Attente',
      'in_progress': 'En Cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  };

  const handleDownloadInvoice = () => {
    if (!reparation?._id) return;
    const link = document.createElement('a');
    link.href = `/api/reparations/${reparation._id}/invoice`;
    link.setAttribute('download', '');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/reparations')}
            icon={<ArrowLeft size={20} />}
            className="flex-shrink-0"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Réparation #{reparation._id?.slice(-6)}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={statusMap[reparationStatus]} className="flex-shrink-0">
                {getStatusLabel(reparationStatus)}
              </Badge>
              {car && (
                <span className="text-gray-500 dark:text-gray-400">
                  {car.make} {car.model}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {getStatusButtons()}
          <Button
            variant="outline"
            onClick={handleDownloadInvoice}
            icon={<Download size={20} />}
            className="flex-1 sm:flex-none"
            title="Télécharger la facture PDF"
          >
            Facture
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/reparations/edit/${reparation._id}`)}
            icon={<Edit size={20} />}
            className="flex-1 sm:flex-none"
          >
            Modifier
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDelete()}
            icon={<Trash2 size={20} />}
            className="flex-1 sm:flex-none text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Supprimer
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Vehicle Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Car size={20} className="text-blue-600 dark:text-blue-400" />
            Informations du Véhicule
          </h2>
          <div className="space-y-4">
            {car && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Marque et Modèle</p>
                  <p className="text-gray-900 dark:text-white">{car.make} {car.model} ({car.year})</p>
                </div>
                {car.licensePlate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Plaque d'Immatriculation</p>
                    <p className="text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {car.licensePlate}
                    </p>
                  </div>
                )}
                {car.owner && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Propriétaire</p>
                    <div className="space-y-1">
                      <p className="text-gray-900 dark:text-white flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        {car.owner.name}
                      </p>
                      {car.owner.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{car.owner.phone}</p>
                      )}
                      {car.owner.email && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{car.owner.email}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Repair Details */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Wrench size={20} className="text-blue-600 dark:text-blue-400" />
            Repair Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <Badge variant={statusMap[reparationStatus]}>
                {getStatusLabel(reparationStatus)}
              </Badge>
            </div>
            {reparation.description && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</p>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {reparation.description}
                </p>
              </div>
            )}
            {reparation.technician && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Technician</p>
                <p className="text-gray-900 dark:text-white">{reparation.technician}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</p>
                <p className="text-gray-900 dark:text-white text-sm">
                  {reparation.startDate ? new Date(reparation.startDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              {reparation.endDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</p>
                  <p className="text-gray-900 dark:text-white text-sm">
                    {new Date(reparation.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Parts & Items */}
      {reparation?.items && reparation.items.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package size={20} className="text-blue-600 dark:text-blue-400" />
            Parts & Items
          </h2>
          <div className="space-y-3">
            {reparation.items.map((itemEntry, index) => {
              const item = typeof itemEntry.item === 'string'
                ? { name: itemEntry.item }
                : itemEntry.item;
              const buyPrice = itemEntry.buyPrice || 0;
              const sellPrice = itemEntry.sellPrice || itemEntry.price || 0;
              const totalPrice = itemEntry.totalPrice || (sellPrice * itemEntry.quantity);
              const itemProfit = (sellPrice - buyPrice) * itemEntry.quantity;
              
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded">Qty: {itemEntry.quantity}</span>
                        <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded">Buy: {formatCurrency(buyPrice)}</span>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded font-medium">
                          Sell: {formatCurrency(sellPrice)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(totalPrice)}</p>
                      {itemProfit > 0 && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          +{formatCurrency(itemProfit)} profit
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="font-bold text-gray-900 dark:text-white">Total Parts Cost</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(reparation.partsCost || 0)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Services */}
      {reparation?.services && reparation.services.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Wrench size={20} className="text-blue-600 dark:text-blue-400" />
            Services
          </h2>
          <div className="space-y-3">
            {reparation.services.map((serviceEntry, index) => {
              const service = typeof serviceEntry.service === 'string'
                ? { name: serviceEntry.service }
                : serviceEntry.service;
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                      {serviceEntry.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{serviceEntry.notes}</p>
                      )}
                    </div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white ml-4">{formatCurrency(serviceEntry.price || 0)}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="font-bold text-gray-900 dark:text-white">Total Services Cost</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">{formatCurrency(reparation.servicesCost || 0)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Cost Summary */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
          Cost Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <p className="text-gray-700 dark:text-gray-300">Parts Cost (to client)</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(reparation?.partsCost || 0)}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <p className="text-gray-700 dark:text-gray-300">Services Cost</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(reparation?.servicesCost || 0)}</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <p className="text-gray-700 dark:text-gray-300">Labor Cost</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(reparation?.laborCost || 0)}</p>
          </div>
          {reparation?.totalProfit !== undefined && reparation.totalProfit > 0 && (
            <div className="flex justify-between items-center py-2 bg-blue-50 dark:bg-blue-900/20 px-3 rounded">
              <p className="font-medium text-blue-700 dark:text-blue-300">Parts Profit</p>
              <p className="font-bold text-blue-700 dark:text-blue-300">+{formatCurrency(reparation.totalProfit)}</p>
            </div>
          )}
          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300 dark:border-gray-600">
            <p className="font-bold text-xl text-gray-900 dark:text-white">Total Revenue</p>
            <p className="font-bold text-2xl text-green-600 dark:text-green-400">{formatCurrency(reparation?.totalCost || 0)}</p>
          </div>
        </div>
      </Card>

      {/* Profit Analysis */}
      {reparation?.totalProfit !== undefined && reparation.totalProfit > 0 && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
            Profit Analysis
          </h2>
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
        </Card>
      )}

      {/* Additional Notes */}
      {reparation?.notes && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
            Additional Notes
          </h2>
          <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
            {reparation.notes}
          </p>
        </Card>
      )}
    </div>
  );
};

export default ReparationDetails; 