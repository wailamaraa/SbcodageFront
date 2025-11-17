import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BaseApiService, QueryParams } from '../services/api/base';

interface UseCrudOptions<T> {
  service: BaseApiService<T>;
  basePath: string;
}

export function useCrud<T>({ service, basePath }: UseCrudOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<QueryParams>({});
  const navigate = useNavigate();

  const loadItems = useCallback(async (params: QueryParams = {}) => {
    setIsLoading(true);
    setCurrentFilters(params); // Store current filters
    try {
      const response = await service.getAll(params);
      if (response?.success) {
        setItems(response.data || []);
        setTotal(response.count || 0);
        setCurrentPage(response.page || 1);
        setTotalPages(response.pages || 1);
        return {
          data: response.data,
          count: response.count,
          page: response.page,
          pages: response.pages
        };
      }
    } catch (error) {
      console.error('Failed to load items:', error);
      toast.error('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const getItem = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await service.getById(id);
      return response?.data;
    } catch (error) {
      console.error('Failed to get item:', error);
      toast.error('Failed to get item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const createItem = useCallback(async (data: Partial<T>) => {
    setIsLoading(true);
    try {
      const response = await service.create(data);
      toast.success('Item created successfully');
      navigate(basePath);
      return response?.data;
    } catch (error) {
      console.error('Failed to create item:', error);
      toast.error('Failed to create item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service, navigate, basePath]);

  const updateItem = useCallback(async (id: string, data: Partial<T>) => {
    setIsLoading(true);
    try {
      const response = await service.update(id, data);
      toast.success('Item updated successfully');
      navigate(basePath);
      return response?.data;
    } catch (error) {
      console.error('Failed to update item:', error);
      toast.error('Failed to update item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service, navigate, basePath]);

  const deleteItem = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setIsLoading(true);
    try {
      await service.delete(id);
      toast.success('Item deleted successfully');
      // Reload the list with current filters
      loadItems(currentFilters);
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    } finally {
      setIsLoading(false);
    }
  }, [service, loadItems, currentFilters]);

  return {
    items,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
  };
} 