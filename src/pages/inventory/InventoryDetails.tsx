import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, DollarSign, Tag, Hash, FileText, Clock, Plus, ArrowLeft, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { inventoryApi } from '../../services/api/inventory';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-hot-toast';

const InventoryDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading, handleDelete, refresh } = useDetails({
    service: inventoryApi,
    basePath: '/inventory',
    id
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [isUpdating, setIsUpdating] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-8">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Article non trouvé</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/inventory')}
          icon={<ArrowLeft size={20} />}
        >
          Retour à l'Inventaire
        </Button>
      </div>
    );
  }

  const handleAddQuantity = async () => {
    if (quantity <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await inventoryApi.updateQuantity(id, quantity, 'add');
      if (response.success) {
        toast.success('Quantité mise à jour avec succès');
        refresh();
      } else {
        toast.error(response.message || 'Échec de la mise à jour de la quantité');
      }
    } catch (error) {
      toast.error('Une erreur s\'est produite lors de la mise à jour de la quantité');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStockStatus = () => {
    const threshold = item.threshold || 10;
    if (item.quantity === 0) return { variant: 'danger' as const, label: 'Rupture de Stock', icon: AlertTriangle };
    if (item.quantity <= threshold) return { variant: 'danger' as const, label: 'Stock Faible', icon: AlertTriangle };
    if (item.quantity <= threshold * 2) return { variant: 'warning' as const, label: 'Stock Faible', icon: AlertTriangle };
    return { variant: 'success' as const, label: 'En Stock', icon: Package };
  };

  const calculateProfit = () => {
    const buyPrice = item.buyPrice || item.price || 0;
    const sellPrice = item.sellPrice || item.price || 0;
    const profit = sellPrice - buyPrice;
    const profitPercent = buyPrice > 0 ? ((profit / buyPrice) * 100).toFixed(1) : '0';
    const totalStockValue = profit * item.quantity;
    return { profit, profitPercent, totalStockValue };
  };

  const stockStatus = getStockStatus();
  const { profit, profitPercent, totalStockValue } = calculateProfit();
  const category = typeof item.category === 'string' ? { name: item.category } : item.category;
  const fournisseur = typeof item.fournisseur === 'string' ? { name: 'Inconnu' } : item.fournisseur;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/inventory')}
            icon={<ArrowLeft size={20} />}
            className="flex-shrink-0"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{item.itemCode || 'Aucun code article'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/inventory/edit/${item._id}`)}
            icon={<Edit size={20} />}
            className="flex-1 sm:flex-none"
          >
            Modifier
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDelete()}
            icon={<Trash2 size={20} />}
            className="flex-1 sm:flex-none text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Item Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations de l'Article</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom</h3>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">{item.name}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Code Article</h3>
                </div>
                <p className="text-gray-900 dark:text-white">{item.itemCode || 'Non défini'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Catégorie</h3>
                </div>
                <Badge variant="gray">{category?.name || 'Non Catégorisé'}</Badge>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fournisseur</h3>
                </div>
                <p className="text-gray-900 dark:text-white">{fournisseur?.name || 'Inconnu'}</p>
              </div>

              {item.description && (
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                  </div>
                  <p className="text-gray-900 dark:text-white">{item.description}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Pricing Info */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tarification</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prix d'Achat</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(item.buyPrice || item.price || 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Du fournisseur</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prix de Vente</h3>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(item.sellPrice || item.price || 0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Au client</p>
              </div>
            </div>
          </Card>

          {/* Profit Analysis */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analyse de Profit</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-blue-900 dark:text-blue-100">Par Unité</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(profit)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-900 dark:text-blue-100">Marge</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {profitPercent}%
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-sm text-blue-900 dark:text-blue-100">Valeur Totale du Stock</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(totalStockValue)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Stock Management */}
        <div className="space-y-4 sm:space-y-6">
          {/* Stock Status */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">État du Stock</h2>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <stockStatus.icon size={24} className={`${stockStatus.variant === 'danger' ? 'text-red-500' : stockStatus.variant === 'warning' ? 'text-yellow-500' : 'text-green-500'}`} />
                <Badge variant={stockStatus.variant} className="text-lg px-3 py-1">
                  {item.quantity}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stockStatus.label}</p>
              <p className="text-xs text-gray-400">Seuil: {item.threshold || 10}</p>
            </div>
          </Card>

          {/* Quick Stock Update */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ajouter du Stock</h2>
            <div className="space-y-4">
              <Input
                type="number"
                label="Quantité à Ajouter"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                className="w-20"
              />
              <Button
                variant="primary"
                onClick={handleAddQuantity}
                disabled={isUpdating}
                icon={<Plus size={16} />}
                className="w-full"
              >
                {isUpdating ? 'Ajout...' : 'Ajouter du Stock'}
              </Button>
            </div>
          </Card>

          {/* Additional Info */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Supplémentaires</h2>
            <div className="space-y-3">
              {item.location && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Emplacement</p>
                  <p className="text-gray-900 dark:text-white">{item.location}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Créé</p>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {item.notes && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                  <p className="text-gray-900 dark:text-white text-sm">{item.notes}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails; 