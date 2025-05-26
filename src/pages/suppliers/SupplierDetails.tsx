import React from 'react';
import { useParams } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Clock, FileText } from 'lucide-react';
import { suppliersApi } from '../../services/api/suppliers';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';

const SupplierDetails: React.FC = () => {
  const { id = '' } = useParams();
  const { data: supplier, isLoading, handleDelete } = useDetails({
    service: suppliersApi,
    basePath: '/suppliers',
    id
  });

  if (!supplier && !isLoading) {
    return null;
  }

  return (
    <BaseDetails
      title={supplier?.name || 'Supplier Details'}
      basePath="/suppliers"
      data={supplier!}
      isLoading={isLoading}
      onDelete={handleDelete}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
          </div>
          <p className="text-gray-900 dark:text-white">{supplier?.name}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            <a href={`mailto:${supplier?.email}`} className="hover:underline">
              {supplier?.email}
            </a>
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Phone size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            <a href={`tel:${supplier?.phone}`} className="hover:underline">
              {supplier?.phone}
            </a>
          </p>
        </div>

        {supplier?.address && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
            </div>
            <p className="text-gray-900 dark:text-white">{supplier.address}</p>
          </div>
        )}

        {supplier?.description && (
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
            </div>
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{supplier.description}</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {supplier?.createdAt ? new Date(supplier.createdAt).toLocaleString() : '-'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {supplier?.updatedAt ? new Date(supplier.updatedAt).toLocaleString() : '-'}
          </p>
        </div>
      </div>
    </BaseDetails>
  );
};

export default SupplierDetails;