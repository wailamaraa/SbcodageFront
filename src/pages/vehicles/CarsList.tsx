import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car as CarIcon, Calendar, User, FileText, Plus, Search, Filter, Edit, Trash2, Phone, Mail, Hash } from 'lucide-react';
import { carsApi } from '../../services/api/cars';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useCrud } from '../../hooks/useCrud';
import { Car } from '../../types';

const CarsList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [yearFilter, setYearFilter] = useState('');

  const {
    items: cars,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems: loadCars,
    deleteItem: deleteCar
  } = useCrud<Car>({
    service: carsApi,
    basePath: '/vehicles'
  });

  useEffect(() => {
    const params = {
      page,
      limit: pageSize,
      sort,
      ...(search && { search }),
      ...(yearFilter && { year: parseInt(yearFilter) })
    };
    loadCars(params);
  }, [loadCars, page, pageSize, search, sort, yearFilter]);

  // Sync page state when currentPage changes from API response
  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Véhicules</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/vehicles/new')}
          icon={<Plus size={20} />}
          className="w-full sm:w-auto"
        >
          Nouveau Véhicule
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Input
              placeholder="Rechercher des véhicules..."
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value); }}
              className="pl-10"
              icon={<Search size={20} className="text-gray-400" />}
            />
          </div>
          <Select
            value={sort}
            onChange={e => { setPage(1); setSort(e.target.value); }}
            options={[
              { value: '-createdAt', label: 'Plus Récent' },
              { value: 'createdAt', label: 'Plus Ancien' },
              { value: 'make', label: 'Marque (A-Z)' },
              { value: '-make', label: 'Marque (Z-A)' },
              { value: 'year', label: 'Année (Ancien vers Nouveau)' },
              { value: '-year', label: 'Année (Nouveau vers Ancien)' },
            ]}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <Input
            placeholder="Filtrer par année"
            value={yearFilter}
            onChange={e => { setPage(1); setYearFilter(e.target.value); }}
            type="number"
            min="1900"
            max="2030"
            icon={<Calendar size={20} className="text-gray-400" />}
          />
          <Select
            value={pageSize.toString()}
            onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}
            options={[6, 12, 24, 48].map(size => ({ value: size.toString(), label: `${size} par page` }))}
            icon={<Filter size={20} className="text-gray-400" />}
          />
        </div>
      </Card>

      {/* Cars Grid - Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cars.map((car) => (
          <div 
            key={car._id} 
            className="cursor-pointer"
            onClick={() => navigate(`/vehicles/${car._id}`)}
          >
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CarIcon size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{car.year}</p>
                  </div>
                </div>
              </div>

              {/* License Plate & VIN */}
              <div className="space-y-2 mb-4">
                {car.licensePlate && (
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {car.licensePlate}
                    </span>
                  </div>
                )}
                
                {car.vin && (
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate">
                      VIN: {car.vin}
                    </span>
                  </div>
                )}
              </div>

              {/* Owner Information */}
              {car.owner && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {car.owner.name}
                    </span>
                  </div>
                  
                  {car.owner.email && (
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {car.owner.email}
                      </span>
                    </div>
                  )}
                  
                  {car.owner.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {car.owner.phone}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Preview */}
              {car.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 italic">
                    "{car.notes}"
                  </p>
                </div>
              )}

              {/* Status & Last Service */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant={car.status === 'active' ? 'success' : 'gray'}>
                  {car.status || 'Inactive'}
                </Badge>
                
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={12} />
                  <span>
                    {car.lastService 
                      ? new Date(car.lastService).toLocaleDateString()
                      : 'Aucun service'
                    }
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/vehicles/edit/${car._id}`);
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
                    deleteCar(car._id);
                  }}
                  icon={<Trash2 size={14} />}
                  className="flex-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Supprimer
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && cars.length === 0 && (
        <Card className="p-8 text-center">
          <CarIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun véhicule trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? 'Essayez d\'ajuster vos termes de recherche' : 'Commencez par ajouter votre premier véhicule'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/vehicles/new')}
            icon={<Plus size={20} />}
          >
            Ajouter le Premier Véhicule
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {cars.length} sur {total} véhicules
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

export default CarsList; 