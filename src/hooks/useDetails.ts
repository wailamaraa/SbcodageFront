import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BaseApiService, ApiResponse } from '../services/api/base';

interface UseDetailsOptions<T> {
  service: BaseApiService<T>;
  basePath: string;
  id: string;
}

// Type guard to check if response is a direct data object
function isDirectResponse<T extends { _id: string }>(response: ApiResponse<T> | T): response is T {
  return '_id' in response;
}

export function useDetails<T extends { _id: string }>({ service, basePath, id }: UseDetailsOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await service.getById(id);
      
      // Add debug logging
      console.log('API Response:', response);
      
      // Handle both wrapped and direct response formats
      if ('success' in response && response.success && response.data) {
        // Response is wrapped with success/data
        setData(response.data);
      } else if (isDirectResponse(response)) {
        // Response is direct data
        setData(response);
      } else {
        console.error('Invalid API response format:', response);
        toast.error('Failed to load data');
        navigate(basePath);
      }
    } catch (error) {
      console.error('Failed to load item:', error);
      toast.error('Failed to load item');
      navigate(basePath);
    } finally {
      setIsLoading(false);
    }
  }, [service, id, navigate, basePath]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await service.delete(id);
      // Handle both response formats
      const isSuccess = 'success' in response ? response.success : response === true;
      if (isSuccess) {
        toast.success('Item deleted successfully');
        navigate(basePath);
      } else {
        console.error('Delete request failed:', response);
        toast.error('Failed to delete item');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
      setIsLoading(false);
    }
  }, [service, id, navigate, basePath]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [loadData, id]);

  return {
    data,
    isLoading,
    handleDelete,
    refresh: loadData
  };
} 