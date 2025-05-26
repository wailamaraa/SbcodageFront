import React from 'react';
import { useParams } from 'react-router-dom';
import { Package, DollarSign, Tag, Hash, FileText, Clock } from 'lucide-react';
import { inventoryApi } from '../../services/api/inventory';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';

const InventoryDetails: React.FC = () => {
  const { id = '' } = useParams();
  const { data: item, isLoading, handleDelete } = useDetails({
    service: inventoryApi,
    basePath: '/inventory',
    id
  });

  if (!item && !isLoading) {
    return null;
  }

  const quantity = item?.quantity || 0;

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
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</h3>
          </div>
          <p className="text-gray-900 dark:text-white">${item?.price?.toFixed(2)}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</h3>
          </div>
          <Badge variant={quantity <= 10 ? 'danger' : quantity <= 20 ? 'warning' : 'success'}>
            {quantity}
          </Badge>
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