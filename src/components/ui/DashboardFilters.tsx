import React from 'react';
import { Calendar } from 'lucide-react';

interface DashboardFiltersProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  startDate,
  endDate,
  onDateChange,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
        <Calendar className="h-5 w-5" />
        <span className="font-medium">Date Range</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="date"
            className="block w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              onDateChange(date, endDate);
            }}
            placeholder="Start Date"
          />
        </div>

        <span className="text-gray-500 dark:text-gray-400">to</span>

        <div className="relative">
          <input
            type="date"
            className="block w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              onDateChange(startDate, date);
            }}
            placeholder="End Date"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters; 