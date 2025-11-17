// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
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
      return { label: 'Disponible', color: 'success' };
    case 'low_stock':
      return { label: 'Stock Faible', color: 'warning' };
    case 'out_of_stock':
      return { label: 'Rupture de Stock', color: 'danger' };
    case 'used':
      return { label: 'Utilisé', color: 'secondary' };
    default:
      return { label: 'Inconnu', color: 'secondary' };
  }
};

// Get status label and color for repair status
export const getRepairStatusInfo = (status: string): { label: string; color: string } => {
  switch (status) {
    case 'pending':
      return { label: 'En Attente', color: 'warning' };
    case 'in_progress':
      return { label: 'En Cours', color: 'primary' };
    case 'completed':
      return { label: 'Terminé', color: 'success' };
    case 'cancelled':
      return { label: 'Annulé', color: 'danger' };
    default:
      return { label: 'Inconnu', color: 'secondary' };
  }
};