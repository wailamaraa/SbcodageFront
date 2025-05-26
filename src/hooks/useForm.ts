import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BaseApiService } from '../services/api/base';

interface UseFormOptions<T> {
  service: BaseApiService<T>;
  basePath: string;
  id?: string;
  initialData?: Partial<T>;
}

interface ApiError {
  field: string;
  message: string;
}

export function useForm<T>({ service, basePath, id, initialData = {} }: UseFormOptions<T>) {
  const [data, setData] = useState<T>({ ...initialData } as T);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = id 
        ? await service.update(id, data)
        : await service.create(data);

      if (response.success && !response.errors?.length) {
        toast.success(id ? 'Item updated successfully' : 'Item created successfully');
        navigate(basePath);
      } else if (response.errors?.length) {
        // Handle validation errors
        response.errors.forEach((error: ApiError) => {
          toast.error(`${error.field}: ${error.message}`);
        });
      } else {
        toast.error(response.message || 'Failed to save item');
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      toast.error('Failed to save item');
    } finally {
      setIsLoading(false);
    }
  }, [service, id, data, navigate, basePath]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setData(prev => {
      // Handle nested object paths (e.g., "owner.name")
      const parts = name.split('.');
      if (parts.length === 1) {
        // Simple field
        return {
          ...prev,
          [name]: type === 'number' ? Number(value) : value
        };
      } else {
        // Nested field
        const [parent, child] = parts;
        return {
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: type === 'number' ? Number(value) : value
          }
        };
      }
    });
  }, []);

  return {
    data,
    isLoading,
    handleSubmit,
    handleChange,
    handleInputChange
  };
} 