import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { stockTransactionsApi } from '../../services/api/stockTransactions';
import { itemsApi } from '../../services/api/items';
import { suppliersApi } from '../../services/api/suppliers';
import { Item, Supplier } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import { toast } from 'react-hot-toast';

const StockTransactionForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item: '',
    type: 'purchase' as 'purchase' | 'adjustment' | 'damage' | 'return_to_supplier',
    quantity: 0,
    fournisseur: '',
    reference: '',
    notes: ''
  });

  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
    loadSuppliers();
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemsApi.getAll({ limit: 1000 });
      if (response.success && response.data) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await suppliersApi.getAll({ limit: 1000 });
      if (response.success && response.data) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast.error('Failed to load suppliers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item) {
      toast.error('Please select an item');
      return;
    }

    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    try {
      setSaving(true);
      
      const response = await stockTransactionsApi.create({
        item: formData.item,
        type: formData.type,
        quantity: formData.quantity,
        fournisseur: formData.fournisseur || undefined,
        reference: formData.reference || undefined,
        notes: formData.notes || undefined
      });

      if (response.success) {
        toast.success('Stock transaction created successfully');
        navigate('/stock-transactions');
      } else {
        toast.error(response.message || 'Failed to create transaction');
      }
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to create transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const transactionTypes = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'damage', label: 'Damage' },
    { value: 'return_to_supplier', label: 'Return to Supplier' }
  ];

  const itemOptions = items.map(item => ({
    value: item._id,
    label: `${item.name} (${item.itemCode || 'No Code'})`
  }));

  const supplierOptions = [
    { value: '', label: 'No Supplier' },
    ...suppliers.map(supplier => ({
      value: supplier._id,
      label: supplier.name
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/stock-transactions')}
          icon={<ArrowLeft size={20} />}
        >
          Back to Transactions
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          New Stock Transaction
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Item *"
              value={formData.item}
              onChange={(e) => handleInputChange('item', e.target.value)}
              options={itemOptions}
              required
            />

            <Select
              label="Transaction Type *"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              options={transactionTypes}
              required
            />

            <Input
              label="Quantity *"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              required
            />

            <Select
              label="Supplier"
              value={formData.fournisseur}
              onChange={(e) => handleInputChange('fournisseur', e.target.value)}
              options={supplierOptions}
            />

            <Input
              label="Reference"
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              placeholder="Numéro de facture, numéro de commande, etc."
            />
          </div>

          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Notes supplémentaires sur cette transaction..."
            rows={3}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/stock-transactions')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              icon={<Save size={20} />}
            >
              {saving ? 'Création...' : 'Créer la Transaction'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StockTransactionForm;
