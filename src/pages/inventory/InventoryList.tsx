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
      header: 'Price',
      accessor: (item: Item) => (
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-400" />
          <span>{formatCurrency(item.price)}</span>
        </div>
      ),
      className: 'min-w-[120px]'
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