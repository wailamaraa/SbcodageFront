import React from 'react';
import { Package, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, ArrowLeftRight, Trash2 } from 'lucide-react';
import { stockTransactionsApi } from '../../services/api/stockTransactions';
import { StockTransaction } from '../../types';
import { BaseList } from '../../components/common/BaseList';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

const StockTransactionsList: React.FC = () => {
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
        return 'warning';
      case 'damage':
      case 'return_to_supplier':
        return 'danger';
      default:
        return 'gray';
    }
  };

  const columns = [
    {
      header: 'Date',
      accessor: (transaction: StockTransaction) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {new Date(transaction.createdAt).toLocaleDateString()}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(transaction.createdAt).toLocaleTimeString()}
          </span>
        </div>
      ),
      className: 'min-w-[120px]'
    },
    {
      header: 'Type',
      accessor: (transaction: StockTransaction) => (
        <div className="flex items-center gap-2">
          {getTransactionIcon(transaction.type)}
          <Badge variant={getTransactionBadgeVariant(transaction.type)}>
            {transaction.type.replace(/_/g, ' ')}
          </Badge>
        </div>
      ),
      className: 'min-w-[180px]'
    },
    {
      header: 'Item',
      accessor: (transaction: StockTransaction) => {
        const item = typeof transaction.item === 'string' 
          ? { name: transaction.item, itemCode: '' } 
          : transaction.item;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            {item.itemCode && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.itemCode}
              </span>
            )}
          </div>
        );
      },
      className: 'min-w-[200px]'
    },
    {
      header: 'Quantity Change',
      accessor: (transaction: StockTransaction) => {
        const isIncrease = ['purchase', 'reparation_return', 'adjustment'].includes(transaction.type);
        const isDecrease = ['sale', 'reparation_use', 'damage', 'return_to_supplier'].includes(transaction.type);
        
        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className={`font-bold ${isIncrease ? 'text-green-600 dark:text-green-400' : isDecrease ? 'text-red-600 dark:text-red-400' : 'text-gray-600'}`}>
                {isIncrease ? '+' : isDecrease ? '-' : ''}{transaction.quantity}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {transaction.quantityBefore} → {transaction.quantityAfter}
              </span>
            </div>
          </div>
        );
      },
      className: 'min-w-[120px]'
    },
    {
      header: 'Amount',
      accessor: (transaction: StockTransaction) => (
        <div className="flex flex-col">
          <span className="font-medium">{formatCurrency(transaction.totalAmount)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            @ {formatCurrency(transaction.unitPrice)} each
          </span>
        </div>
      ),
      className: 'min-w-[120px]'
    },
    {
      header: 'Reference',
      accessor: (transaction: StockTransaction) => {
        if (transaction.reparation && typeof transaction.reparation !== 'string') {
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Reparation
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {transaction.reparation.description}
              </span>
            </div>
          );
        }
        if (transaction.reference) {
          return (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {transaction.reference}
            </span>
          );
        }
        return <span className="text-xs text-gray-400">-</span>;
      },
      className: 'min-w-[150px]'
    },
    {
      header: 'Created By',
      accessor: (transaction: StockTransaction) => (
        <span className="text-sm">{transaction.createdBy?.name || 'System'}</span>
      ),
      className: 'min-w-[120px]'
    }
  ];

  return (
    <BaseList<StockTransaction>
      title="Stock Transactions"
      basePath="/stock-transactions"
      service={stockTransactionsApi}
      columns={columns}
      sortOptions={[
        { value: '-createdAt', label: 'Newest First' },
        { value: 'createdAt', label: 'Oldest First' },
        { value: 'type', label: 'Type A-Z' },
        { value: '-type', label: 'Type Z-A' },
      ]}
      searchPlaceholder="Search transactions..."
      emptyMessage="No transactions found"
      createButtonLabel=""
    />
  );
};

export default StockTransactionsList;
