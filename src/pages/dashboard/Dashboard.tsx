import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, Truck, Tag, Car, Wrench, TrendingUp, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { dashboardApi } from '../../services/api/dashboard';
import Card from '../../components/ui/Card';
import DashboardFilters from '../../components/ui/DashboardFilters';
import LowStockAlerts from '../../components/common/LowStockAlerts';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { formatCurrency } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardData {
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
    completed: number;
    revenue: number;
    dateDebut: string | null;
    dateFin: string | null;
  };
  topItems: Array<{
    _id: string;
    name: string;
    quantity: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (startDate) {
        params.dateDebut = startDate.toISOString().split('T')[0];
      }
      if (endDate) {
        params.dateFin = endDate.toISOString().split('T')[0];
      }

      const response = await dashboardApi.getStats(params);
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  const handleDateChange = (newStartDate: Date | null, newEndDate: Date | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{error || 'Échec du chargement des données du tableau de bord'}</p>
      </div>
    );
  }

  // Prepare data for bar chart
  const topItemsData = {
    labels: stats.topItems.map((item: { name: string }) => item.name),
    datasets: [
      {
        label: 'Quantité Utilisée',
        data: stats.topItems.map((item: { quantity: number }) => item.quantity),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Prepare data for inventory status pie chart
  const inventoryStatusData = {
    labels: ['Disponible', 'Stock Faible', 'Rupture de Stock'],
    datasets: [
      {
        data: [
          stats.counts.items - stats.inventory.lowStock - stats.inventory.outOfStock,
          stats.inventory.lowStock,
          stats.inventory.outOfStock,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Vue d'Ensemble du Tableau de Bord
        </h1>
        <DashboardFilters
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                <ArrowUp className="inline-block h-4 w-4" /> 12%
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.inventory.value || 0)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Valeur Totale de l'Inventaire</p>
            </div>
          </div>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-300">
                <ArrowDown className="inline-block h-4 w-4" /> 5%
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.inventory.lowStock}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Articles en Stock Faible</p>
            </div>
          </div>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Wrench className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-300">
                <ArrowUp className="inline-block h-4 w-4" /> 8%
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.repairs.active}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Réparations Actives</p>
            </div>
          </div>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-300">
                <ArrowUp className="inline-block h-4 w-4" /> 15%
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.repairs.revenue || 0)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Chiffre d'Affaires Mensuel</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <div className="p-4">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-300">Articles</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.counts.items}</h3>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <div className="p-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-green-600 dark:text-green-300" />
              <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-300">Fournisseurs</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.counts.fournisseurs}</h3>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <div className="p-4">
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              <span className="ml-2 text-sm font-medium text-purple-600 dark:text-purple-300">Catégories</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.counts.categories}</h3>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800">
          <div className="p-4">
            <div className="flex items-center">
              <Car className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              <span className="ml-2 text-sm font-medium text-amber-600 dark:text-amber-300">Véhicules</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.counts.cars}</h3>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800">
          <div className="p-4">
            <div className="flex items-center">
              <Wrench className="h-5 w-5 text-red-600 dark:text-red-300" />
              <span className="ml-2 text-sm font-medium text-red-600 dark:text-red-300">Réparations</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stats.counts.reparations}</h3>
          </div>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LowStockAlerts maxItems={5} showViewAll={true} />
        </div>
        
        {/* Profit Metrics Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-2 border-green-200 dark:border-green-700">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-green-600 dark:bg-green-500">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Métriques de Profit</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Chiffre d'Affaires Mensuel</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(stats.repairs.revenue || 0)}
                </p>
              </div>
              <div className="pt-4 border-t border-green-200 dark:border-green-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Valeur de l'Inventaire</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.inventory.value || 0)}
                </p>
              </div>
              <div className="pt-4 border-t border-green-200 dark:border-green-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Réparations Actives</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.repairs.active}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats.repairs.completed} réparations terminées
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Articles les Plus Utilisés</h3>
            <div className="h-80">
              <Bar
                data={topItemsData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </Card>

        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">État de l'Inventaire</h3>
            <div className="h-80 flex items-center justify-center">
              <div className="w-2/3 h-2/3">
                <Pie
                  data={inventoryStatusData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
