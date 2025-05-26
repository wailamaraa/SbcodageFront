import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../types';
import { useList } from '../../hooks/useList';
import { vehiclesApi } from '../../services/api/vehicles';
import BaseList from '../../components/common/BaseList';

const VehicleList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, handleDelete } = useList<Car>({
    service: vehiclesApi,
    basePath: '/vehicles'
  });

  const columns = [
    {
      header: 'Make',
      accessor: 'make'
    },
    {
      header: 'Model',
      accessor: 'model'
    },
    {
      header: 'Year',
      accessor: 'year'
    },
    {
      header: 'Owner',
      accessor: 'owner.name',
      cell: (row: Car) => row.owner?.name || 'N/A'
    }
  ];

  return (
    <BaseList
      title="Vehicles"
      data={data}
      columns={columns}
      isLoading={isLoading}
      error={error}
      onDelete={handleDelete}
      onView={(id) => navigate(`/vehicles/${id}`)}
      onEdit={(id) => navigate(`/vehicles/edit/${id}`)}
      onAdd={() => navigate('/vehicles/new')}
    />
  );
};

export default VehicleList; 