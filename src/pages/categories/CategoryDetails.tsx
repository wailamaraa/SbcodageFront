import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, FileText, Clock, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { categoriesApi } from '../../services/api/categories';
import { useDetails } from '../../hooks/useDetails';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CategoryDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: category, isLoading, handleDelete } = useDetails({
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

  if (!category) {
    return (
      <div className="text-center py-8">
        <Tag size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Catégorie non trouvée</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/categories')}
          icon={<ArrowLeft size={20} />}
        >
          Retour aux Catégories
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/categories')}
            icon={<ArrowLeft size={20} />}
            className="flex-shrink-0"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">Détails de la Catégorie</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/categories/edit/${category._id}`)}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations de la Catégorie</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag size={16} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom</h3>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{category.name}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
              </div>
              {category.description ? (
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {category.description}
                </p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">Aucune description fournie</p>
              )}
            </div>
          </div>
        </Card>

        {/* Metadata */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Métadonnées</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Créé</h3>
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(category.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière Mise à Jour</h3>
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(category.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CategoryDetails;