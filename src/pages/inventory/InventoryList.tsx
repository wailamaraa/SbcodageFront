import React, { useState, useEffect } from 'react';
import { Package, Tag, Truck, Search, Filter, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { inventoryApi } from '../../services/api/inventory';
import { Item } from '../../types';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { useCrud } from '../../hooks/useCrud';

const InventoryList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');

  const {
    items,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems,
    deleteItem
  } = useCrud<Item>({
    service: inventoryApi,
    basePath: '/inventory'
  });

  useEffect(() => {
    loadItems({
      page,
      limit: pageSize,
      sort,
      ...(search && { search })
    });
  }, [loadItems, page, pageSize, search, sort]);

  const getStockStatus = (item: Item) => {
    const threshold = item.threshold || 10;
    if (item.quantity === 0) return { variant: 'danger' as const, label: 'Rupture de Stock', icon: AlertTriangle };
    if (item.quantity <= threshold) return { variant: 'danger' as const, label: 'Stock Faible', icon: AlertTriangle };
    if (item.quantity <= threshold * 2) return { variant: 'warning' as const, label: 'Stock Faible', icon: AlertTriangle };
    return { variant: 'success' as const, label: 'En Stock', icon: Package };
  };

  const calculateProfit = (item: Item) => {
    const buyPrice = item.buyPrice || item.price || 0;
    const sellPrice = item.sellPrice || item.price || 0;
    const profit = sellPrice - buyPrice;
    const profitPercent = buyPrice > 0 ? ((profit / buyPrice) * 100).toFixed(1) : '0';
    return { profit, profitPercent };
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventaire</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/inventory/new')}
          icon={<Plus size={20} />}
          className="w-full sm:w-auto"
        >
          Nouvel Article
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              placeholder="Rechercher dans l'inventaire..."
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
              { value: 'sellPrice', label: 'Prix Croissant' },
              { value: '-sellPrice', label: 'Prix Décroissant' },
              { value: 'quantity', label: 'Quantité Croissante' },
              { value: '-quantity', label: 'Quantité Décroissante' },
            ]}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <Select
            value={pageSize.toString()}
            onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}
            options={[5, 10, 20, 50].map(size => ({ value: size.toString(), label: `${size} par page` }))}
            icon={<Filter size={20} className="text-gray-400" />}
          />
        </div>
      </Card>

      {/* Items Grid - Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const stockStatus = getStockStatus(item);
          const { profit, profitPercent } = calculateProfit(item);
          const category = typeof item.category === 'string' ? { name: item.category } : item.category;
          const fournisseur = typeof item.fournisseur === 'string' ? { name: 'Inconnu' } : item.fournisseur;

          return (
            <div 
              key={item._id} 
              className="cursor-pointer"
              onClick={() => navigate(`/inventory/${item._id}`)}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
              {/* Header with Stock Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-gray-400 flex-shrink-0" />
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                </div>
                <Badge variant={stockStatus.variant} className="flex-shrink-0">
                  {item.quantity}
                </Badge>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Pricing Info */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Prix d'Achat</span>
                  <span className="text-sm font-medium">{formatCurrency(item.buyPrice || item.price || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Prix de Vente</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(item.sellPrice || item.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Profit</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrency(profit)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {profitPercent}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Category and Supplier */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-gray-400 flex-shrink-0" />
                  <Badge variant="gray" className="text-xs truncate">
                    {category?.name || 'Non Catégorisé'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {fournisseur?.name || 'Inconnu'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/inventory/edit/${item._id}`);
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
                    deleteItem(item._id);
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
      {!isLoading && items.length === 0 && (
        <Card className="p-8 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun article trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? 'Essayez d\'ajuster vos termes de recherche' : 'Commencez par ajouter votre premier article d\'inventaire'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/inventory/new')}
            icon={<Plus size={20} />}
          >
            Ajouter le Premier Article
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {items.length} sur {total} articles
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
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
                onClick={() => setPage(page + 1)}
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

export default InventoryList; 