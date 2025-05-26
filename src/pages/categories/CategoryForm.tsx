import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categoriesApi } from '../../services/api/categories';
import { Category } from '../../types';
import { BaseForm } from '../../components/common/BaseForm';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';

const CategoryForm: React.FC = () => {
  const { id } = useParams();
  const {
    data,
    isLoading,
    handleSubmit,
    handleInputChange
  } = useForm<Category>({
    service: categoriesApi,
    basePath: '/categories',
    id
  });

  useEffect(() => {
    if (id) {
      // Load category data if editing
      categoriesApi.getById(id).then(response => {
        if (response?.success) {
          Object.entries(response.data).forEach(([key, value]) => {
            const input = document.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input) {
              input.value = value as string;
            }
          });
        }
      });
    }
  }, [id]);

  return (
    <BaseForm
      title={id ? 'Edit Category' : 'New Category'}
      basePath="/categories"
      isLoading={isLoading}
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
            placeholder="Enter category name"
          />
        </div>

        <div>
          <TextArea
            label="Description"
            name="description"
            value={data.description || ''}
            onChange={handleInputChange}
            placeholder="Enter category description"
            rows={4}
          />
        </div>
      </div>
    </BaseForm>
  );
};

export default CategoryForm;