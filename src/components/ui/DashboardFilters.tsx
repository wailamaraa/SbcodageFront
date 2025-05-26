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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <Calendar size={20} />
          <span className="font-medium">Date Range</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="date"
              className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                onDateChange(date, endDate);
              }}
              placeholder="Start Date"
            />
          </div>
          
          <div className="relative">
            <input
              type="date"
              className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
    </div>
  );
};

export default DashboardFilters; 