import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { inventoryApi } from '../../services/api/inventory';
import { categoriesApi } from '../../services/api/categories';
import { suppliersApi } from '../../services/api/suppliers';
import { Item, Category, Supplier } from '../../types';
import { BaseForm } from '../../components/common/BaseForm';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';

interface InventoryFormProps {
  isEditing?: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ isEditing }) => {
  const { id } = useParams();
  const {
    data,
    isLoading,
    handleSubmit: handleFormSubmit,
    handleInputChange: handleInputChangeOriginal,
    handleChange
  } = useForm<Item>({
    service: inventoryApi,
    basePath: '/inventory',
    id: isEditing ? id : undefined
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

        if (categoriesRes.success) setCategories(categoriesRes.data);
        if (suppliersRes.success) setSuppliers(suppliersRes.data);
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

  return (
    <BaseForm
      title={id ? 'Edit Item' : 'New Item'}
      basePath="/inventory"
      isLoading={isLoading || loading}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <Input
            label="Name"
            name="name"
            value={data.name || ''}
            onChange={handleInputChange}
            required
            placeholder="Enter item name"
          />
        </div>

        <div>
          <TextArea
            label="Description"
            name="description"
            value={data.description || ''}
            onChange={handleInputChange}
            placeholder="Enter item description"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Price"
              name="price"
              type="number"
              value={data.price || ''}
              onChange={handleInputChange}
              required
              placeholder="Enter item price"
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={data.quantity || ''}
              onChange={handleInputChange}
              required
              placeholder="Enter item quantity"
              min={0}
            />
          </div>
        </div>

        <div>
          <Select
            label="Category"
            name="category"
            value={categoryId || ''}
            onChange={handleInputChange}
            required
            options={[
              { value: '', label: 'Select a category' },
              ...categories.map(category => ({
                value: category._id,
                label: category.name
              }))
            ]}
          />
        </div>

        <div>
          <Select
            label="Supplier"
            name="fournisseur"
            value={fournisseurId || ''}
            onChange={handleInputChange}
            required
            options={[
              { value: '', label: 'Select a supplier' },
              ...suppliers.map(supplier => ({
                value: supplier._id,
                label: supplier.name
              }))
            ]}
          />
        </div>
      </div>
    </BaseForm>
  );
};

export default InventoryForm; 