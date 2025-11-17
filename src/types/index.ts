export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  owner: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  buyPrice: number; // Purchase price from supplier
  sellPrice: number; // Price charged to client
  profitMargin?: number; // Virtual field: sellPrice - buyPrice
  profitMarginPercent?: string; // Virtual field: profit percentage
  category: Category | string | null;
  fournisseur: Supplier | string | null;
  status: 'available' | 'low_stock' | 'out_of_stock';
  threshold: number;
  location?: string;
  itemCode: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Deprecated field for backward compatibility
  price?: number;
}

export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  vin?: string;
  status?: 'active' | 'inactive';
  owner: {
    name: string;
    email?: string;
    phone?: string;
  };
  notes?: string;
  lastService?: Date;
  nextService?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RepairItem {
  item: Item;
  quantity: number;
  price: number;
}

export interface Repair {
  _id: string;
  car: Car;
  description: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technician: string;
  items: RepairItem[];
  totalCost: number;
  laborCost: number;
  notes: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  counts: {
    items: number;
    fournisseurs: number;
    categories: number;
    cars: number;
    reparations: number;
  };
  inventory: {
    value: number;
    lowStock: number;
    outOfStock: number;
  };
  repairs: {
    active: number;
    completedLastMonth: number;
    revenue: number;
  };
  topItems: Array<{
    _id: string;
    name: string;
    quantity: number;
  }>;
  recentRepairs: Array<{
    _id: string;
    car: {
      make: string;
      model: string;
      year: number;
    };
    description: string;
    startDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    totalCost: number;
  }>;
}

export interface Service {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: 'maintenance' | 'repair' | 'diagnostic' | 'bodywork' | 'other';
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReparationItem {
  _id: string;
  item: string | { _id: string; name: string; price: number };
  quantity: number;
  price: number;
}

export interface ReparationService {
  _id: string;
  service: string | { _id: string; name: string; price: number };
  price: number;
  notes: string;
}

export interface Reparation {
  _id: string;
  car: string | {
    _id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    notes?: string;
    owner: {
      name: string;
      email: string;
      phone?: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  description: string;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technician: string;
  items: Array<{
    _id: string;
    item: string | {
      _id: string;
      name: string;
      description?: string;
      quantity: number;
      buyPrice?: number;
      sellPrice?: number;
      price: number;
      category: string;
      status: string;
      location?: string;
      itemCode?: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
    };
    quantity: number;
    buyPrice: number; // Price at time of use
    sellPrice: number; // Price charged to client
    totalPrice: number; // sellPrice * quantity
    price?: number; // Deprecated
  }>;
  services: Array<{
    _id: string;
    service: string | {
      _id: string;
      name: string;
      description?: string;
      price: number;
      duration: number;
      category: string;
      status: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
    };
    price: number;
    notes?: string;
  }>;
  totalCost: number;
  partsCost: number;
  laborCost: number;
  servicesCost: number;
  totalProfit?: number; // Profit from parts only
  notes?: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StockTransaction {
  _id: string;
  item: string | {
    _id: string;
    name: string;
    itemCode: string;
  };
  type: 'purchase' | 'sale' | 'adjustment' | 'reparation_use' | 'reparation_return' | 'damage' | 'return_to_supplier';
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  unitPrice: number;
  totalAmount: number;
  reparation?: string | {
    _id: string;
    description: string;
    status: string;
  };
  fournisseur?: string | {
    _id: string;
    name: string;
  };
  reference?: string;
  notes?: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}