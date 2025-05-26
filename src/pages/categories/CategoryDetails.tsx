import React from 'react';
import { useParams } from 'react-router-dom';
import { Tag, FileText, Clock } from 'lucide-react';
import { categoriesApi } from '../../services/api/categories';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';

const CategoryDetails: React.FC = () => {
  const { id = '' } = useParams();
  const { data: category, isLoading, handleDelete } = useDetails({
    service: categoriesApi,
    basePath: '/categories',
    id
  });

  if (!category && !isLoading) {
    return null;
  }

  return (
    <BaseDetails
      title={category?.name || 'Category Details'}
      basePath="/categories"
      data={category!}
      isLoading={isLoading}
      onDelete={handleDelete}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
          </div>
          <p className="text-gray-900 dark:text-white">{category?.name}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
          </div>
          <p className="text-gray-900 dark:text-white">{category?.description || 'No description'}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {category?.createdAt ? new Date(category.createdAt).toLocaleString() : '-'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {category?.updatedAt ? new Date(category.updatedAt).toLocaleString() : '-'}
          </p>
        </div>
      </div>
    </BaseDetails>
  );
};

export default CategoryDetails;