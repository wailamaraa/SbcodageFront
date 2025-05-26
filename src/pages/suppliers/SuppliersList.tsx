import React from 'react';
import { Building2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { suppliersApi } from '../../services/api/suppliers';
import { Supplier } from '../../types';
import { BaseList } from '../../components/common/BaseList';

const SuppliersList: React.FC = () => {
  const columns = [
    { 
      header: 'Name', 
      accessor: (supplier: Supplier) => (
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-gray-400" />
          <div className="font-medium">{supplier.name}</div>
        </div>
      ),
      className: 'min-w-[200px]'
    },
    { 
      header: 'Email', 
      accessor: (supplier: Supplier) => (
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-400" />
          <span>{supplier.email}</span>
        </div>
      ),
      className: 'min-w-[200px]'
    },
    {
      header: 'Phone',
      accessor: (supplier: Supplier) => (
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-gray-400" />
          <span>{supplier.phone}</span>
        </div>
      ),
      className: 'min-w-[150px]'
    },
    {
      header: 'Address',
      accessor: (supplier: Supplier) => supplier.address ? (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{supplier.address}</span>
        </div>
      ) : null,
      className: 'min-w-[300px]'
    },
    {
      header: 'Created At',
      accessor: (supplier: Supplier) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span>{new Date(supplier.createdAt).toLocaleDateString()}</span>
        </div>
      ),
      className: 'min-w-[150px]'
    }
  ];

  return (
    <BaseList<Supplier>
      title="Suppliers"
      basePath="/suppliers"
      service={suppliersApi}
      columns={columns}
      sortOptions={[
        { value: '-createdAt', label: 'Newest First' },
        { value: 'createdAt', label: 'Oldest First' },
        { value: 'name', label: 'Name A-Z' },
        { value: '-name', label: 'Name Z-A' },
      ]}
      searchPlaceholder="Search suppliers..."
      createButtonLabel="New Supplier"
      emptyMessage="No suppliers found"
    />
  );
};

export default SuppliersList;