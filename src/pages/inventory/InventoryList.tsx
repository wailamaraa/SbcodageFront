import React from 'react';
import { Package, DollarSign, Tag, Hash, Truck } from 'lucide-react';
import { inventoryApi } from '../../services/api/inventory';
import { Item } from '../../types';
import { BaseList } from '../../components/common/BaseList';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

const InventoryList: React.FC = () => {
  const columns = [
    {
      header: 'Name',
      accessor: (item: Item) => (
        <div className="flex items-start gap-2">
          <Package size={16} className="text-gray-400 mt-1" />
          <div className="flex flex-col">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {item.description || 'No description'}
            </div>
          </div>
        </div>
      ),
      className: 'min-w-[300px]'
    },
    {
      header: 'Buy Price',
      accessor: (item: Item) => (
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-400" />
          <span className="text-sm">{formatCurrency(item.buyPrice || item.price || 0)}</span>
        </div>
      ),
      className: 'min-w-[100px]'
    },
    {
      header: 'Sell Price',
      accessor: (item: Item) => (
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium">{formatCurrency(item.sellPrice || item.price || 0)}</span>
        </div>
      ),
      className: 'min-w-[100px]'
    },
    {
      header: 'Profit',
      accessor: (item: Item) => {
        const buyPrice = item.buyPrice || item.price || 0;
        const sellPrice = item.sellPrice || item.price || 0;
        const profit = sellPrice - buyPrice;
        const profitPercent = buyPrice > 0 ? ((profit / buyPrice) * 100).toFixed(1) : '0';
        
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {formatCurrency(profit)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {profitPercent}%
            </span>
          </div>
        );
      },
      className: 'min-w-[100px]'
    },
    {
      header: 'Quantity',
      accessor: (item: Item) => {
        let variant: 'success' | 'warning' | 'danger' = 'success';
        const threshold = item.threshold || 10; // Default to 10 if no threshold is set

        if (item.quantity <= threshold) {
          variant = 'danger';
        } else if (item.quantity <= threshold * 2) {
          variant = 'warning';
        }

        return (
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-gray-400" />
            <div className="flex flex-col">
              <Badge variant={variant}>{item.quantity}</Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Threshold: {threshold}
              </span>
            </div>
          </div>
        );
      },
      className: 'min-w-[120px]'
    },
    {
      header: 'Category',
      accessor: (item: Item) => {
        const category = typeof item.category === 'string' ? { name: item.category } : item.category;
        return (
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-gray-400" />
            <Badge variant="gray">{category?.name || 'Uncategorized'}</Badge>
          </div>
        );
      },
      className: 'min-w-[150px]'
    },
    {
      header: 'Supplier',
      accessor: (item: Item) => {
        const fournisseur = typeof item.fournisseur === 'string' ? { name: 'Unknown' } : item.fournisseur;
        return (
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-gray-400" />
            <span>{fournisseur?.name || 'Unknown'}</span>
          </div>
        );
      },
      className: 'min-w-[150px]'
    }
  ];

  return (
    <BaseList<Item>
      title="Inventory"
      basePath="/inventory"
      service={inventoryApi}
      columns={columns}
      sortOptions={[
        { value: '-createdAt', label: 'Newest First' },
        { value: 'createdAt', label: 'Oldest First' },
        { value: 'name', label: 'Name A-Z' },
        { value: '-name', label: 'Name Z-A' },
        { value: 'price', label: 'Price Low to High' },
        { value: '-price', label: 'Price High to Low' },
        { value: 'quantity', label: 'Quantity Low to High' },
        { value: '-quantity', label: 'Quantity High to Low' },
      ]}
      searchPlaceholder="Search inventory..."
      createButtonLabel="New Item"
      emptyMessage="No items found"
    />
  );
};

export default InventoryList; 