import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, Tag, Truck, DollarSign, Hash, FileText, MapPin } from 'lucide-react';
import { inventoryApi } from '../../services/api/inventory';
import { categoriesApi } from '../../services/api/categories';
import { suppliersApi } from '../../services/api/suppliers';
import { Item, Category, Supplier } from '../../types';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const InventoryForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const {
    data,
    isLoading,
    handleSubmit: handleFormSubmit,
    handleInputChange: handleInputChangeOriginal,
    handleChange
  } = useForm<Item>({
    service: inventoryApi,
    basePath: '/inventory',
    id
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, suppliersRes] = await Promise.all([
          categoriesApi.getAll(),
          suppliersApi.getAll()
        ]);

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (suppliersRes.success && suppliersRes.data) {
          setSuppliers(suppliersRes.data);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Custom input change handler to handle select fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // For category and fournisseur selects, store only the ID
    if (name === 'category' || name === 'fournisseur') {
      handleChange(name, value || null);
    } else {
      handleInputChangeOriginal(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new object with the form data
    const formData = {
      ...data,
      // Ensure category and fournisseur are just IDs
      category: data.category || null,
      fournisseur: data.fournisseur || null
    };

    // Update the data before submission
    Object.entries(formData).forEach(([key, value]) => {
      handleChange(key as keyof Item, value);
    });

    await handleFormSubmit(e);
  };

  // Get the current values for the select inputs
  const categoryId = typeof data.category === 'object' ? data.category?._id : data.category;
  const fournisseurId = typeof data.fournisseur === 'object' ? data.fournisseur?._id : data.fournisseur;

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/inventory')}
          icon={<ArrowLeft size={20} />}
          className="flex-shrink-0"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Modifier l\'Article' : 'Nouvel Article'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Information */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-600 dark:text-blue-400" />
              Informations de Base
            </h2>
            <div className="space-y-4">
              <Input
                label="Nom de l'Article"
                name="name"
                value={data.name || ''}
                onChange={handleInputChange}
                required
                placeholder="Entrez le nom de l'article"
                icon={<Package size={20} className="text-gray-400" />}
              />

              <Input
                label="Code Article"
                name="itemCode"
                value={data.itemCode || ''}
                onChange={handleInputChange}
                placeholder="Code unique de l'article"
                icon={<Hash size={20} className="text-gray-400" />}
              />

              <TextArea
                label="Description"
                name="description"
                value={data.description || ''}
                onChange={handleInputChange}
                placeholder="Description détaillée de l'article"
                rows={3}
              />

              <Select
                label="Catégorie"
                name="category"
                value={categoryId || ''}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Sélectionnez une catégorie' },
                  ...categories.map(category => ({
                    value: category._id,
                    label: category.name
                  }))
                ]}
                icon={<Tag size={20} className="text-gray-400" />}
              />

              <Select
                label="Fournisseur"
                name="fournisseur"
                value={fournisseurId || ''}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Sélectionnez un fournisseur' },
                  ...suppliers.map(supplier => ({
                    value: supplier._id,
                    label: supplier.name
                  }))
                ]}
                icon={<Truck size={20} className="text-gray-400" />}
              />
            </div>
          </Card>

          {/* Pricing & Stock */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
              Tarification et Stock
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Prix d'Achat"
                  name="buyPrice"
                  type="number"
                  value={data.buyPrice || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Prix fournisseur"
                  min={0}
                  step={0.01}
                  icon={<DollarSign size={20} className="text-gray-400" />}
                />

                <Input
                  label="Prix de Vente"
                  name="sellPrice"
                  type="number"
                  value={data.sellPrice || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Prix client"
                  min={0}
                  step={0.01}
                  icon={<DollarSign size={20} className="text-green-600" />}
                />
              </div>

              {/* Profit Margin Display */}
              {data.buyPrice && data.sellPrice && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Marge Bénéficiaire
                      </p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {(Number(data.sellPrice) - Number(data.buyPrice)).toFixed(2)}€
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Pourcentage
                      </p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {((Number(data.sellPrice) - Number(data.buyPrice)) / Number(data.buyPrice) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Quantité"
                  name="quantity"
                  type="number"
                  value={data.quantity || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Quantité en stock"
                  min={0}
                />

                <Input
                  label="Seuil d'Alerte"
                  name="threshold"
                  type="number"
                  value={data.threshold || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Seuil stock faible"
                  min={0}
                />
              </div>

              <Input
                label="Emplacement"
                name="location"
                value={data.location || ''}
                onChange={handleInputChange}
                placeholder="ex: Étagère A-12, Entrepôt B"
                icon={<MapPin size={20} className="text-gray-400" />}
              />

              <TextArea
                label="Notes"
                name="notes"
                value={data.notes || ''}
                onChange={handleInputChange}
                placeholder="Notes supplémentaires"
                rows={2}
              />
            </div>
          </Card>
        </div>

        {/* Actions */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/inventory')}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={20} />}
              className="w-full sm:w-auto"
            >
              {isEditing ? 'Mettre à Jour' : 'Créer l\'Article'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default InventoryForm; 