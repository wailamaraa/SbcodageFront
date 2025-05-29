import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { BaseApiService } from '../../services/api/base';
import Table, { TableProps } from '../ui/Table';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useCrud } from '../../hooks/useCrud';

interface BaseListProps<T> {
  title: string;
  basePath: string;
  service: BaseApiService<T>;
  columns: TableProps<T>['columns'];
  sortOptions?: Array<{ value: string; label: string }>;
  searchPlaceholder?: string;
  createButtonLabel?: string;
  emptyMessage?: string;
  pageSizeOptions?: number[];
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export function BaseList<T extends { _id: string }>({
  title,
  basePath,
  service,
  columns,
  sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' }
  ],
  searchPlaceholder = 'Search...',
  createButtonLabel = 'New Item',
  emptyMessage = 'No items found',
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS
}: BaseListProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const navigate = useNavigate();

  const {
    items,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems,
    deleteItem
  } = useCrud<T>({
    service,
    basePath
  });

  useEffect(() => {
    loadItems({
      page,
      limit: pageSize,
      sort,
      ...(search && { search })
    });
  }, [loadItems, page, pageSize, search, sort]);

  // Add actions column to the table
  const tableColumns = [
    ...columns,
    {
      header: 'Actions',
      accessor: (item: T) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`${basePath}/edit/${item._id}`);
            }}
            icon={<Edit size={16} />}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              deleteItem(item._id);
            }}
            icon={<Trash2 size={16} />}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </Button>
        </div>
      ),
      className: 'w-[200px]'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <Button
            variant="primary"
            onClick={() => navigate(`${basePath}/new`)}
            icon={<Plus size={20} />}
          >
            {createButtonLabel}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => { setPage(1); setSearch(e.target.value); }}
                className="pl-10"
                icon={<Search size={20} className="text-gray-400" />}
              />
            </div>
            <Select
              value={sort}
              onChange={e => { setPage(1); setSort(e.target.value); }}
              options={sortOptions}
              icon={<Filter size={20} className="text-gray-400" />}
            />
            <Select
              value={pageSize.toString()}
              onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}
              options={pageSizeOptions.map(size => ({ value: size.toString(), label: `${size} per page` }))}
              icon={<Filter size={20} className="text-gray-400" />}
            />
          </div>
        </div>

        <Table
          columns={tableColumns}
          data={items}
          keyExtractor={(item) => item._id}
          isLoading={isLoading}
          onRowClick={(item) => navigate(`${basePath}/${item._id}`)}
          className="w-full"
          emptyMessage={emptyMessage}
        />

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {items.length} of {total} items
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 