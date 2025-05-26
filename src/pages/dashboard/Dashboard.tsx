import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertCircle, Truck, Tag, ShoppingCart, Car, Wrench, TrendingUp, Calendar } from 'lucide-react';
import { DashboardStats } from '../../types';
import Card from '../../components/ui/Card';
import DashboardFilters from '../../components/ui/DashboardFilters';
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

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
      
      // Fetch dashboard stats
      const dashboardResponse = await axios.get('https://sbcodageback.onrender.com/api/dashboard', { params });
      setStats(dashboardResponse.data.data);
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
        <p>{error || 'Failed to load dashboard data'}</p>
      </div>
    );
  }

  // Prepare data for bar chart
  const topItemsData = {
    labels: stats.topItems.map(item => item.name),
    datasets: [
      {
        label: 'Quantity Used',
        data: stats.topItems.map(item => item.quantity),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for inventory status pie chart
  const inventoryStatusData = {
    labels: ['Available', 'Low Stock', 'Out of Stock'],
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Filters */}
      <DashboardFilters
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
      />
      
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-800 bg-opacity-30">
              <Package size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Inventory Value</p>
              <h3 className="text-xl font-bold">${stats.inventory.value != null ? stats.inventory.value.toLocaleString() : 'N/A'}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-700 bg-opacity-30">
              <AlertCircle size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Low Stock Items</p>
              <h3 className="text-xl font-bold">{stats.inventory.lowStock}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-800 bg-opacity-30">
              <Wrench size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Active Repairs</p>
              <h3 className="text-xl font-bold">{stats.repairs.active}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-800 bg-opacity-30">
              <TrendingUp size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Monthly Revenue</p>
              <h3 className="text-xl font-bold">${stats.repairs.revenue != null ? stats.repairs.revenue.toLocaleString() : 'N/A'}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Count Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <Package size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Items</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stats.counts.items}</h3>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <Truck size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Suppliers</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stats.counts.fournisseurs}</h3>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
              <Tag size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stats.counts.categories}</h3>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300">
              <Car size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vehicles</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stats.counts.cars}</h3>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
              <Wrench size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Repairs</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stats.counts.reparations}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Used Items" className="dark:bg-gray-800">
          <div className="h-80">
            <Bar data={topItemsData} options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </div>
        </Card>
        
        <Card title="Inventory Status" className="dark:bg-gray-800">
          <div className="h-80 flex items-center justify-center">
            <div className="w-2/3 h-2/3">
              <Pie data={inventoryStatusData} options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
