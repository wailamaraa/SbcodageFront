import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, ArrowLeftRight, Trash2, Calendar, FileText, User, Building } from 'lucide-react';
import { stockTransactionsApi } from '../../services/api/stockTransactions';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';

const StockTransactionDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: transaction, isLoading } = useDetails({
    service: stockTransactionsApi,
    basePath: '/stock-transactions',
    id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-8">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Transaction non trouvée</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/stock-transactions')}
          icon={<ArrowLeft size={20} />}
        >
          Retour aux Transactions
        </Button>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp size={20} className="text-green-600 dark:text-green-400" />;
      case 'sale':
        return <TrendingDown size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'reparation_use':
        return <Package size={20} className="text-purple-600 dark:text-purple-400" />;
      case 'reparation_return':
        return <RefreshCw size={20} className="text-cyan-600 dark:text-cyan-400" />;
      case 'adjustment':
        return <ArrowLeftRight size={20} className="text-yellow-600 dark:text-yellow-400" />;
      case 'damage':
        return <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />;
      case 'return_to_supplier':
        return <Trash2 size={20} className="text-orange-600 dark:text-orange-400" />;
      default:
        return <Package size={20} className="text-gray-400" />;
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

  const item = typeof transaction.item === 'string' 
    ? { name: transaction.item || 'Article inconnu', itemCode: '' } 
    : transaction.item || { name: 'Article inconnu', itemCode: '' };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/stock-transactions')}
            icon={<ArrowLeft size={20} />}
            className="flex-shrink-0"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Détails de la Transaction
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getTransactionBadgeVariant(transaction.type)} className="flex-shrink-0">
                {getTransactionLabel(transaction.type)}
              </Badge>
              <span className={`text-lg font-bold ${
                transaction.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Transaction Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            {getTransactionIcon(transaction.type)}
            Informations de la Transaction
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Article</p>
              <p className="text-gray-900 dark:text-white font-medium">{item.name}</p>
              {item.itemCode && (
                <p className="text-xs text-gray-500 dark:text-gray-400">Code: {item.itemCode}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prix Unitaire</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(transaction.unitPrice || 0)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Montant Total</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency((transaction.unitPrice || 0) * Math.abs(transaction.quantity))}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Quantité</p>
              <span className={`text-2xl font-bold ${
                transaction.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
              </span>
            </div>

            {transaction.reference && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Référence</p>
                <p className="text-gray-900 dark:text-white font-medium">{transaction.reference}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
            Informations Complémentaires
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date de Création</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="text-gray-900 dark:text-white text-sm">
                  {new Date(transaction.createdAt).toLocaleDateString('fr-FR')} à {new Date(transaction.createdAt).toLocaleTimeString('fr-FR')}
                </p>
              </div>
            </div>

            {transaction.fournisseur && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fournisseur</p>
                <div className="flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white">
                    {typeof transaction.fournisseur === 'string' 
                      ? transaction.fournisseur 
                      : transaction.fournisseur.name}
                  </p>
                </div>
              </div>
            )}

            {transaction.reparation && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Réparation Liée</p>
                <p className="text-gray-900 dark:text-white">
                  Réparation #{typeof transaction.reparation === 'string' 
                    ? transaction.reparation.slice(-6) 
                    : transaction.reparation._id?.slice(-6)}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Créé par</p>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <p className="text-gray-900 dark:text-white">
                  {typeof transaction.createdBy === 'string' 
                    ? transaction.createdBy 
                    : transaction.createdBy?.name || 'Système'}
                </p>
              </div>
            </div>

            {transaction.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg whitespace-pre-wrap">
                  {transaction.notes}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StockTransactionDetails;
