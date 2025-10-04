import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, DollarSign, Tag, Hash, FileText, Clock, Plus, TrendingUp, History } from 'lucide-react';
import { inventoryApi } from '../../services/api/inventory';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-toastify';
import { StockTransaction } from '../../types';

const InventoryDetails: React.FC = () => {
  const { id = '' } = useParams();
  const { data: item, isLoading, handleDelete, refresh } = useDetails({
    service: inventoryApi,
    basePath: '/inventory',
    id
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [stockHistory, setStockHistory] = useState<StockTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchStockHistory = async () => {
      if (!id || !showHistory) return;
      setLoadingHistory(true);
      try {
        const response = await inventoryApi.getHistory(id);
        if (response.success && response.data) {
          setStockHistory(response.data);
        }
      } catch (error) {
        console.error('Error fetching stock history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchStockHistory();
  }, [id, showHistory]);

  if (!item && !isLoading) {
    return null;
  }

  const handleAddQuantity = async () => {
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await inventoryApi.updateQuantity(id, quantity, 'add');
      if (response.success) {
        toast.success('Quantity updated successfully');
        refresh();
      } else {
        toast.error(response.message || 'Failed to update quantity');
      }
    } catch (error) {
      toast.error('An error occurred while updating quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <BaseDetails
      title={item?.name || 'Item Details'}
      basePath="/inventory"
      data={item!}
      isLoading={isLoading}
      onDelete={handleDelete}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
          </div>
          <p className="text-gray-900 dark:text-white">{item?.name}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Buy Price</h3>
          </div>
          <p className="text-gray-900 dark:text-white">{formatCurrency(item?.buyPrice || item?.price || 0)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">From supplier</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-green-600 dark:text-green-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sell Price</h3>
          </div>
          <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(item?.sellPrice || item?.price || 0)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">To client</p>
        </div>

        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit Margin</h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100">Per Unit</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency((item?.sellPrice || item?.price || 0) - (item?.buyPrice || item?.price || 0))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-900 dark:text-blue-100">Percentage</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {((((item?.sellPrice || item?.price || 0) - (item?.buyPrice || item?.price || 0)) / (item?.buyPrice || item?.price || 1)) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-900 dark:text-blue-100">Total Stock Value</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(((item?.sellPrice || item?.price || 0) - (item?.buyPrice || item?.price || 0)) * (item?.quantity || 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</h3>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={(item?.quantity || 0) <= 10 ? 'danger' : (item?.quantity || 0) <= 20 ? 'warning' : 'success'}>
              {item?.quantity}
            </Badge>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                className="w-20"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddQuantity}
                disabled={isUpdating}
                className="flex items-center gap-1"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
          </div>
          <Badge variant="gray">
            {typeof item?.category === 'string' ? item.category : item?.category?.name}
          </Badge>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {typeof item?.fournisseur === 'string' ? item.fournisseur : item?.fournisseur?.name || 'Unknown'}
          </p>
        </div>

        {item?.description && (
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
            </div>
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{item.description}</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {item?.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {item?.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}
          </p>
        </div>
      </div>
    </BaseDetails>
  );
};

export default InventoryDetails; 