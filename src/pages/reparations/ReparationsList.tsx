import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, User, DollarSign, Clock, TrendingUp, Plus, Search, Filter, Edit, Trash2, Wrench, Calendar, Download } from 'lucide-react';
import { reparationsApi } from '../../services/api/reparations';
import { Reparation } from '../../types';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useCrud } from '../../hooks/useCrud';
import { formatCurrency } from '../../utils/formatters';
import { exportInvoice } from '../../utils/invoiceExport';
import { toast } from 'react-hot-toast';

const ReparationsList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [statusFilter, setStatusFilter] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('');

  const {
    items: reparations,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems: loadReparations,
    deleteItem: deleteReparation
  } = useCrud<Reparation>({
    service: reparationsApi,
    basePath: '/reparations'
  });

  useEffect(() => {
    const params = {
      page,
      limit: pageSize,
      sort,
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
      ...(technicianFilter && { technician: technicianFilter })
    };
    loadReparations(params);
  }, [loadReparations, page, pageSize, search, sort, statusFilter, technicianFilter]);

  // Sync page state when currentPage changes from API response
  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pending: {
        variant: 'warning' as const,
        label: 'En Attente',
        icon: Clock,
        description: 'En attente de démarrage'
      },
      in_progress: {
        variant: 'info' as const,
        label: 'En Cours',
        icon: Wrench,
        description: 'Travail en cours'
      },
      completed: {
        variant: 'success' as const,
        label: 'Terminé',
        icon: TrendingUp,
        description: 'Travail terminé'
      },
      cancelled: {
        variant: 'danger' as const,
        label: 'Annulé',
        icon: Clock,
        description: 'Travail annulé'
      }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const handleStatusChange = async (reparationId: string, newStatus: string) => {
    try {
      await reparationsApi.updateStatus(reparationId, newStatus as Reparation['status']);
      // Reload the list to reflect changes
      loadReparations({
        page,
        limit: pageSize,
        sort,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(technicianFilter && { technician: technicianFilter })
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleExportInvoice = async (reparation: Reparation, format: 'html' | 'pdf') => {
    try {
      await exportInvoice(reparation, { format });
      toast.success(`Facture exportée en ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Failed to export invoice:', error);
      toast.error('Erreur lors de l\'export de la facture');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Réparations</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/reparations/new')}
          icon={<Plus size={20} />}
          className="w-full sm:w-auto"
        >
          Nouvelle Réparation
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Input
              placeholder="Rechercher des réparations..."
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value); }}
              className="pl-10"
              icon={<Search size={20} className="text-gray-400" />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={e => { setPage(1); setStatusFilter(e.target.value); }}
            options={[
              { value: '', label: 'Tous les Statuts' },
              { value: 'pending', label: 'En Attente' },
              { value: 'in_progress', label: 'En Cours' },
              { value: 'completed', label: 'Terminé' },
              { value: 'cancelled', label: 'Annulé' }
            ]}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <Input
            placeholder="Filtrer par technicien"
            value={technicianFilter}
            onChange={e => { setPage(1); setTechnicianFilter(e.target.value); }}
            icon={<User size={20} className="text-gray-400" />}
          />
          <Select
            value={sort}
            onChange={e => { setPage(1); setSort(e.target.value); }}
            options={[
              { value: '-createdAt', label: 'Plus Récent' },
              { value: 'createdAt', label: 'Plus Ancien' },
              { value: 'totalCost', label: 'Coût Croissant' },
              { value: '-totalCost', label: 'Coût Décroissant' },
              { value: 'status', label: 'Statut A-Z' },
              { value: '-status', label: 'Statut Z-A' },
            ]}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <Select
            value={pageSize.toString()}
            onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}
            options={[6, 12, 24, 48].map(size => ({ value: size.toString(), label: `${size} par page` }))}
            icon={<Filter size={20} className="text-gray-400" />}
          />
        </div>
      </Card>

      {/* Reparations Grid - Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reparations.map((reparation) => {
          const statusInfo = getStatusInfo(reparation.status || 'pending');
          const car = typeof reparation.car === 'string' 
            ? { make: 'Unknown', model: 'Unknown', year: 'N/A', owner: { name: 'Unknown' } }
            : reparation.car;

          return (
            <div 
              key={reparation._id} 
              className="cursor-pointer"
              onClick={() => navigate(`/reparations/${reparation._id}`)}
            >
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow h-full">
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Wrench size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        Reparation #{reparation._id?.slice(-6)}
                      </h3>
                    </div>
                  </div>
                  <Badge variant={statusInfo.variant} className="flex-shrink-0">
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* Vehicle Information */}
                {car && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {car.make} {car.model} ({car.year})
                      </span>
                    </div>
                    {car.owner && (
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          Owner: {car.owner.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {reparation.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {reparation.description}
                    </p>
                  </div>
                )}

                {/* Technician */}
                {reparation.technician && (
                  <div className="flex items-center gap-2 mb-3">
                    <User size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {reparation.technician}
                    </span>
                  </div>
                )}

                {/* Cost & Profit */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Cost</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(reparation.totalCost || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp size={12} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Profit</span>
                    </div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrency(reparation.totalProfit || 0)}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>
                      {reparation.createdAt 
                        ? new Date(reparation.createdAt).toLocaleDateString()
                        : 'Aucune date'
                      }
                    </span>
                  </div>
                  {reparation.endDate && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>
                        {new Date(reparation.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Change Buttons */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {reparation.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(reparation._id, 'in_progress');
                        }}
                        className="text-xs px-2 py-1 text-blue-600 hover:text-blue-700"
                      >
                        Commencer
                      </Button>
                    )}
                    {reparation.status === 'in_progress' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(reparation._id, 'completed');
                        }}
                        className="text-xs px-2 py-1 text-green-600 hover:text-green-700"
                      >
                        Terminer
                      </Button>
                    )}
                    {(reparation.status === 'pending' || reparation.status === 'in_progress') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(reparation._id, 'cancelled');
                        }}
                        className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 justify-center items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportInvoice(reparation, 'pdf');
                    }}
                    icon={<Download size={12} />}
                    className="flex-1 text-xs justify-center items-center"
                    title="Export facture PDF"
                  >
                    Facture
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/reparations/edit/${reparation._id}`);
                    }}
                    icon={<Edit size={12} />}
                    className="flex-1 text-xs justify-center items-center"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReparation(reparation._id);
                    }}
                    icon={<Trash2 size={12} />}
                    className="flex-1 text-xs justify-center items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Supprimer
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!isLoading && reparations.length === 0 && (
        <Card className="p-8 text-center">
          <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune réparation trouvée</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? 'Essayez d\'ajuster vos termes de recherche' : 'Commencez par créer votre première réparation'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/reparations/new')}
            icon={<Plus size={20} />}
          >
            Créer la Première Réparation
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {reparations.length} sur {total} réparations
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                Précédent
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1"
              >
                Suivant
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReparationsList; 