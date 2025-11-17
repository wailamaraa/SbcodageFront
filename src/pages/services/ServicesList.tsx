import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Tag, Plus, Search, Filter, Edit, Trash2, Settings } from 'lucide-react';
import { servicesApi } from '../../services/api/services';
import { Service } from '../../types';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useCrud } from '../../hooks/useCrud';
import { formatCurrency } from '../../utils/formatters';

const ServicesList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    items: services,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems: loadServices,
    deleteItem: deleteService
  } = useCrud<Service>({
    service: servicesApi,
    basePath: '/services'
  });

  useEffect(() => {
    const params = {
      page,
      limit: pageSize,
      sort,
      ...(search && { search }),
      ...(categoryFilter && { category: categoryFilter }),
      ...(statusFilter && { status: statusFilter })
    };
    loadServices(params);
  }, [loadServices, page, pageSize, search, sort, categoryFilter, statusFilter]);

  // Sync page state when currentPage changes from API response
  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  const getCategoryInfo = (category: string) => {
    const categoryConfig = {
      repair: { label: 'Réparation', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      maintenance: { label: 'Maintenance', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      bodywork: { label: 'Carrosserie', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      diagnostic: { label: 'Diagnostic', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      other: { label: 'Autre', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
    };
    return categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/services/new')}
          icon={<Plus size={20} />}
          className="w-full sm:w-auto"
        >
          Nouveau Service
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Input
              placeholder="Rechercher des services..."
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value); }}
              className="pl-10"
              icon={<Search size={20} className="text-gray-400" />}
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={e => { setPage(1); setCategoryFilter(e.target.value); }}
            options={[
              { value: '', label: 'Toutes Catégories' },
              { value: 'repair', label: 'Réparation' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'bodywork', label: 'Carrosserie' },
              { value: 'diagnostic', label: 'Diagnostic' },
              { value: 'other', label: 'Autre' }
            ]}
            icon={<Tag size={20} className="text-gray-400" />}
          />
          <Select
            value={statusFilter}
            onChange={e => { setPage(1); setStatusFilter(e.target.value); }}
            options={[
              { value: '', label: 'Tous Statuts' },
              { value: 'active', label: 'Actif' },
              { value: 'inactive', label: 'Inactif' }
            ]}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <Select
            value={sort}
            onChange={e => { setPage(1); setSort(e.target.value); }}
            options={[
              { value: '-createdAt', label: 'Plus Récent' },
              { value: 'createdAt', label: 'Plus Ancien' },
              { value: 'name', label: 'Nom A-Z' },
              { value: '-name', label: 'Nom Z-A' },
              { value: 'price', label: 'Prix Croissant' },
              { value: '-price', label: 'Prix Décroissant' },
              { value: 'duration', label: 'Durée Croissante' },
              { value: '-duration', label: 'Durée Décroissante' }
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

      {/* Services Grid - Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service) => {
          const categoryInfo = getCategoryInfo(service.category);

          return (
            <div 
              key={service._id} 
              className="cursor-pointer"
              onClick={() => navigate(`/services/${service._id}`)}
            >
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow h-full">
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Settings size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {service.name}
                      </h3>
                    </div>
                  </div>
                  <Badge variant={service.status === 'active' ? 'success' : 'gray'} className="flex-shrink-0">
                    {service.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>

                {/* Description */}
                {service.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                )}

                {/* Category */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                    <Tag size={12} />
                    {categoryInfo.label}
                  </span>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Prix</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Durée</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.duration}h
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {service.notes && (
                  <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {service.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/services/edit/${service._id}`);
                    }}
                    icon={<Edit size={14} />}
                    className="flex-1 text-xs"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteService(service._id);
                    }}
                    icon={<Trash2 size={14} />}
                    className="flex-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
      {!isLoading && services.length === 0 && (
        <Card className="p-8 text-center">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun service trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? 'Essayez d\'ajuster vos critères de recherche' : 'Commencez par créer votre premier service'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/services/new')}
            icon={<Plus size={20} />}
          >
            Créer le Premier Service
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {services.length} sur {total} services
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

export default ServicesList; 