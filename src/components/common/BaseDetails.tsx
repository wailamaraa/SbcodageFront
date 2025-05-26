import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface BaseDetailsProps<T> {
  title: string;
  basePath: string;
  data: T;
  isLoading?: boolean;
  onDelete?: () => void;
  children: React.ReactNode;
  extraActions?: React.ReactNode;
}

export function BaseDetails<T extends { _id: string }>({
  title,
  basePath,
  data,
  isLoading,
  onDelete,
  children,
  extraActions
}: BaseDetailsProps<T>) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(basePath)}
            icon={<ArrowLeft size={20} />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {extraActions}
          <Button
            variant="outline"
            onClick={() => navigate(`${basePath}/${data._id}/edit`)}
            icon={<Edit size={20} />}
            disabled={isLoading}
          >
            Edit
          </Button>
          {onDelete && (
            <Button
              variant="danger"
              onClick={onDelete}
              icon={<Trash2 size={20} />}
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <Card>
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            children
          )}
        </div>
      </Card>
    </div>
  );
} 