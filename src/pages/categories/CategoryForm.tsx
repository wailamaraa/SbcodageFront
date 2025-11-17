import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Tag } from 'lucide-react';
import { categoriesApi } from '../../services/api/categories';
import { Category } from '../../types';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CategoryForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (isLoading) {
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
          onClick={() => navigate('/categories')}
          icon={<ArrowLeft size={20} />}
          className="flex-shrink-0"
        >
          Retour
        </Button>
        <div className="flex items-center gap-2">
          <Tag size={24} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {id ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Nom de la Catégorie *"
              name="name"
              value={data.name || ''}
              onChange={handleInputChange}
              required
              placeholder="Entrez le nom de la catégorie (ex: Électronique, Vêtements, etc.)"
              className="w-full"
            />

            <TextArea
              label="Description"
              name="description"
              value={data.description || ''}
              onChange={handleInputChange}
              placeholder="Entrez une description détaillée de cette catégorie..."
              rows={4}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/categories')}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              icon={<Save size={20} />}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? 'Enregistrement...' : id ? 'Mettre à Jour la Catégorie' : 'Créer la Catégorie'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CategoryForm;