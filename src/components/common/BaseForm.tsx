import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface BaseFormProps {
  title: string;
  basePath: string;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export const BaseForm: React.FC<BaseFormProps> = ({
  title,
  basePath,
  isLoading,
  onSubmit,
  children
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(basePath)}
          icon={<ArrowLeft size={20} />}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {children}

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(basePath)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
            >
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}; 