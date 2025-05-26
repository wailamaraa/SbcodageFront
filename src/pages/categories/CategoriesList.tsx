import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Tag, Clock, FileText } from 'lucide-react';
import { categoriesApi } from '../../services/api';
import { Category } from '../../types';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useCrud } from '../../hooks/useCrud';

const PAGE_SIZE = 10;

const CategoriesList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const navigate = useNavigate();

  const {
    items: categories,
    total,
    isLoading,
    loadItems: loadCategories,
    deleteItem: deleteCategory
  } = useCrud<Category>({
    service: categoriesApi,
    basePath: '/categories'
  });

  useEffect(() => {
    loadCategories({
      page,
      limit: PAGE_SIZE,
      sort,
      ...(search && { search })
    });
  }, [loadCategories, page, search, sort]);

  const columns = [
    { 
      header: 'Name', 
      accessor: (category: Category) => (
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-gray-400" />
          <div className="font-medium">{category.name}</div>
        </div>
      ),
      className: 'min-w-[200px]'
    },
    { 
      header: 'Description', 
      accessor: (category: Category) => (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gray-400" />
          <span className="line-clamp-2">{category.description || 'No description'}</span>
        </div>
      ),
      className: 'min-w-[300px]'
    },
    {
      header: 'Created At',
      accessor: (category: Category) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span>{new Date(category.createdAt).toLocaleDateString()}</span>
        </div>
      ),
      className: 'min-w-[150px]'
    },
  ];

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/categories/new')}
          icon={<Plus size={20} />}
        >
            New Category
        </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                placeholder="Search categories..."
                value={search}
                onChange={e => { setPage(1); setSearch(e.target.value); }}
                className="pl-10"
                icon={<Search size={20} className="text-gray-400" />}
              />
            </div>
            <Select
              value={sort}
              onChange={e => { setPage(1); setSort(e.target.value); }}
              options={[
                { value: '-createdAt', label: 'Newest First' },
                { value: 'createdAt', label: 'Oldest First' },
                { value: 'name', label: 'Name A-Z' },
                { value: '-name', label: 'Name Z-A' },
              ]}
              icon={<Filter size={20} className="text-gray-400" />}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={categories}
          keyExtractor={(category) => category._id}
          isLoading={isLoading}
          onRowClick={(category) => navigate(`/categories/${category._id}`)}
          onDeleteClick={deleteCategory}
          className="w-full"
          emptyMessage="No categories found"
        />

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {categories.length} of {total} categories
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CategoriesList;