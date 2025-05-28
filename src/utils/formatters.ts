// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

// Get status label and color for item stock status
export const getStockStatusInfo = (status: string): { label: string; color: string } => {
  switch (status) {
    case 'available':
      return { label: 'Available', color: 'success' };
    case 'low_stock':
      return { label: 'Low Stock', color: 'warning' };
    case 'out_of_stock':
      return { label: 'Out of Stock', color: 'danger' };
    case 'used':
      return { label: 'Used', color: 'secondary' };
    default:
      return { label: 'Unknown', color: 'secondary' };
  }
};

// Get status label and color for repair status
export const getRepairStatusInfo = (status: string): { label: string; color: string } => {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'warning' };
    case 'in_progress':
      return { label: 'In Progress', color: 'primary' };
    case 'completed':
      return { label: 'Completed', color: 'success' };
    case 'cancelled':
      return { label: 'Cancelled', color: 'danger' };
    default:
      return { label: 'Unknown', color: 'secondary' };
  }
};