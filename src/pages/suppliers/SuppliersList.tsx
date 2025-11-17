import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Clock, Plus, Search, Filter, Edit, Trash2, User } from 'lucide-react';
import { suppliersApi } from '../../services/api/suppliers';
import { Supplier } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useCrud } from '../../hooks/useCrud';

const SuppliersList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');

  const {
    items: suppliers,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems: loadSuppliers,
    deleteItem: deleteSupplier
  } = useCrud<Supplier>({
    service: suppliersApi,
    basePath: '/suppliers'
  });

  useEffect(() => {
    const params = {
      page,
      limit: pageSize,
      sort,
      ...(search && { search })
    };
    loadSuppliers(params);
  }, [loadSuppliers, page, pageSize, search, sort]);

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fournisseurs</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/suppliers/new')}
          icon={<Plus size={20} />}
          className="w-full sm:w-auto"
        >
          Nouveau Fournisseur
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              placeholder="Rechercher des fournisseurs..."
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
              { value: 'name', label: 'Nom A-Z' },
              { value: '-name', label: 'Nom Z-A' },
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

      {/* Suppliers Grid - Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {suppliers.map((supplier) => (
          <div 
            key={supplier._id} 
            className="cursor-pointer"
            onClick={() => navigate(`/suppliers/${supplier._id}`)}
          >
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Building2 size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{supplier.name}</h3>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 mb-4">
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{supplier.email}</span>
                  </div>
                )}
                
                {supplier.contactPerson && (
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{supplier.contactPerson}</span>
                  </div>
                )}

                {supplier.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{supplier.phone}</span>
                  </div>
                )}

                {supplier.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{supplier.address}</span>
                  </div>
                )}
              </div>

              {/* Notes Preview */}
              {supplier.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 italic">
                    "{supplier.notes}"
                  </p>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={14} className="flex-shrink-0" />
                <span>Ajouté le {new Date(supplier.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/suppliers/edit/${supplier._id}`);
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
                    deleteSupplier(supplier._id);
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
      {!isLoading && suppliers.length === 0 && (
        <Card className="p-8 text-center">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun fournisseur trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? 'Essayez d\'ajuster vos termes de recherche' : 'Commencez par ajouter votre premier fournisseur'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/suppliers/new')}
            icon={<Plus size={20} />}
          >
            Ajouter le Premier Fournisseur
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {suppliers.length} sur {total} fournisseurs
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

export default SuppliersList;