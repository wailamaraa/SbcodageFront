import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, ArrowLeftRight, Trash2, Search, Filter, Plus, Calendar, Eye } from 'lucide-react';
import { stockTransactionsApi } from '../../services/api/stockTransactions';
import { StockTransaction } from '../../types';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useCrud } from '../../hooks/useCrud';
import { formatCurrency } from '../../utils/formatters';

const StockTransactionsList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [typeFilter, setTypeFilter] = useState('');
  const [stats, setStats] = useState<any[]>([]);

  const {
    items: transactions,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems: loadTransactions
  } = useCrud<StockTransaction>({
    service: stockTransactionsApi,
    basePath: '/stock-transactions'
  });

  useEffect(() => {
    const params = {
      page,
      limit: pageSize,
      sort,
      ...(search && { search }),
      ...(typeFilter && { type: typeFilter })
    };
    loadTransactions(params);
  }, [loadTransactions, page, pageSize, search, sort, typeFilter]);

  useEffect(() => {
    loadStats();
  }, []);

  // Sync page state when currentPage changes from API response
  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

  const loadStats = async () => {
    try {
      const response = await stockTransactionsApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp size={16} className="text-green-600 dark:text-green-400" />;
      case 'sale':
        return <TrendingDown size={16} className="text-blue-600 dark:text-blue-400" />;
      case 'reparation_use':
        return <Package size={16} className="text-purple-600 dark:text-purple-400" />;
      case 'reparation_return':
        return <RefreshCw size={16} className="text-cyan-600 dark:text-cyan-400" />;
      case 'adjustment':
        return <ArrowLeftRight size={16} className="text-yellow-600 dark:text-yellow-400" />;
      case 'damage':
        return <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />;
      case 'return_to_supplier':
        return <Trash2 size={16} className="text-orange-600 dark:text-orange-400" />;
      default:
        return <Package size={16} className="text-gray-400" />;
    }
  };

  const getTransactionBadgeVariant = (type: string): 'success' | 'info' | 'warning' | 'danger' | 'gray' => {
    switch (type) {
      case 'purchase':
        return 'success';
      case 'sale':
      case 'reparation_use':
        return 'info';
      case 'adjustment':
      case 'reparation_return':
        return 'warning';
      case 'damage':
      case 'return_to_supplier':
        return 'danger';
      default:
        return 'gray';
    }
  };

  const getTransactionLabel = (type: string): string => {
    switch (type) {
      case 'purchase':
        return 'Achat';
      case 'sale':
        return 'Vente';
      case 'reparation_use':
        return 'Utilisation Réparation';
      case 'reparation_return':
        return 'Retour Réparation';
      case 'adjustment':
        return 'Ajustement';
      case 'damage':
        return 'Dommage';
      case 'return_to_supplier':
        return 'Retour Fournisseur';
      default:
        return type;
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions de Stock</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/stock-transactions/new')}
          icon={<Plus size={20} />}
          className="w-full sm:w-auto"
        >
          Nouvelle Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat._id} className="p-4">
              <div className="flex items-center gap-3">
                {getTransactionIcon(stat._id)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {getTransactionLabel(stat._id)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {stat.count}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({stat.totalQuantity} unités)
                    </span>
                  </div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(stat.totalAmount)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Input
              placeholder="Rechercher des transactions..."
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value); }}
              className="pl-10"
              icon={<Search size={20} className="text-gray-400" />}
            />
          </div>
          <Select
            value={typeFilter}
            onChange={e => { setPage(1); setTypeFilter(e.target.value); }}
            options={[
              { value: '', label: 'Tous Types' },
              { value: 'purchase', label: 'Achat' },
              { value: 'sale', label: 'Vente' },
              { value: 'adjustment', label: 'Ajustement' },
              { value: 'reparation_use', label: 'Utilisation Réparation' },
              { value: 'reparation_return', label: 'Retour Réparation' },
              { value: 'damage', label: 'Dommage' },
              { value: 'return_to_supplier', label: 'Retour Fournisseur' }
            ]}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <Select
            value={sort}
            onChange={e => { setPage(1); setSort(e.target.value); }}
            options={[
              { value: '-createdAt', label: 'Plus Récent' },
              { value: 'createdAt', label: 'Plus Ancien' },
              { value: '-quantity', label: 'Quantité Décroissante' },
              { value: 'quantity', label: 'Quantité Croissante' }
            ]}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <Select
            value={pageSize.toString()}
            onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}
            options={[6, 12, 24, 48].map(size => ({ value: size.toString(), label: `${size} par page` }))}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            Total: {total} transactions
          </div>
        </div>
      </Card>

      {/* Transactions Grid - Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {transactions.map((transaction) => {
          const item = typeof transaction.item === 'string' 
            ? { name: transaction.item || 'Article inconnu', itemCode: '' } 
            : transaction.item || { name: 'Article inconnu', itemCode: '' };

          return (
            <div 
              key={transaction._id} 
              className="cursor-pointer"
              onClick={() => navigate(`/stock-transactions/${transaction._id}`)}
            >
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow h-full">
                {/* Header with Type */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getTransactionIcon(transaction.type)}
                    <div className="min-w-0 flex-1">
                      <Badge variant={getTransactionBadgeVariant(transaction.type)} className="text-xs">
                        {getTransactionLabel(transaction.type)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-lg font-bold ${
                      transaction.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                    </span>
                  </div>
                </div>

                {/* Item Information */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {item.name}
                  </h3>
                  {item.itemCode && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Code: {item.itemCode}
                    </p>
                  )}
                </div>

                {/* Price Information */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Prix Unit.</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.unitPrice || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency((transaction.unitPrice || 0) * Math.abs(transaction.quantity))}
                    </p>
                  </div>
                </div>

                {/* Reference & Date */}
                <div className="space-y-2 mb-4">
                  {transaction.reference && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Réf:</span>
                      <span className="text-xs text-gray-900 dark:text-white font-medium">
                        {transaction.reference}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
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
                      navigate(`/stock-transactions/${transaction._id}`);
                    }}
                    icon={<Eye size={14} />}
                    className="flex-1 text-xs"
                  >
                    Détails
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!isLoading && transactions.length === 0 && (
        <Card className="p-8 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune transaction trouvée</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? 'Essayez d\'ajuster vos critères de recherche' : 'Commencez par créer votre première transaction'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/stock-transactions/new')}
            icon={<Plus size={20} />}
          >
            Créer la Première Transaction
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {transactions.length} sur {total} transactions
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

export default StockTransactionsList;
