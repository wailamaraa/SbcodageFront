import React, { useEffect, useState } from 'react';
import { AlertTriangle, Package, TrendingDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../services/api/inventory';
import { Item } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

interface LowStockAlertsProps {
  maxItems?: number;
  showViewAll?: boolean;
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ 
  maxItems = 5,
  showViewAll = true 
}) => {
  const navigate = useNavigate();
  const [lowStockItems, setLowStockItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        const response = await inventoryApi.getLowStock();
        if (response.success && response.data) {
          setLowStockItems(response.data.slice(0, maxItems));
        }
      } catch (err) {
        setError('Échec du chargement des articles en stock faible');
        console.error('Error fetching low stock items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, [maxItems]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle size={20} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} className="text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            État du Stock
          </h3>
        </div>
        <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Package size={48} className="mx-auto mb-2 text-green-600 dark:text-green-400" />
            <p className="font-medium">Tous les articles sont bien approvisionnés !</p>
            <p className="text-sm">Aucune alerte de stock faible pour le moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-600 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alertes de Stock Faible
            </h3>
            <Badge variant="danger">{lowStockItems.length}</Badge>
          </div>
          {showViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/inventory?status=low_stock,out_of_stock')}
              className="flex items-center gap-1"
            >
              Voir Tout
              <ExternalLink size={14} />
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {lowStockItems.map((item) => {
          const isOutOfStock = item.quantity === 0;
          const stockPercentage = item.threshold > 0 
            ? (item.quantity / item.threshold) * 100 
            : 0;

          return (
            <div
              key={item._id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/inventory/${item._id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <Badge variant={isOutOfStock ? 'danger' : 'warning'}>
                      {isOutOfStock ? 'Rupture de Stock' : 'Stock Faible'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <TrendingDown size={14} />
                      <span>
                        <span className="font-semibold">{item.quantity}</span> / {item.threshold} unités
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Vente: </span>
                      <span className="font-medium">{formatCurrency(item.sellPrice || item.price || 0)}</span>
                    </div>
                  </div>

                  {/* Stock Level Bar */}
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOutOfStock
                          ? 'bg-red-600 dark:bg-red-500'
                          : stockPercentage < 50
                          ? 'bg-orange-600 dark:bg-orange-500'
                          : 'bg-yellow-600 dark:bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {typeof item.category === 'object' && item.category?.name}
                  </div>
                  {typeof item.fournisseur === 'object' && item.fournisseur?.name && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Fournisseur: {item.fournisseur.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showViewAll && lowStockItems.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/inventory?status=low_stock,out_of_stock')}
          >
            Voir Tous les Articles en Stock Faible
          </Button>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;
