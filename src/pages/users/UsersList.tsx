import React from 'react';
import { User, Shield, Mail, Clock } from 'lucide-react';
import { usersApi } from '../../services/api/users';
import { User as UserType } from '../../types';
import { BaseList } from '../../components/common/BaseList';
import Badge from '../../components/ui/Badge';

const UsersList: React.FC = () => {
  const columns = [
    { 
      header: 'Name', 
      accessor: (user: UserType) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <div className="font-medium">{user.name}</div>
        </div>
      ),
      className: 'min-w-[200px]'
    },
    { 
      header: 'Email', 
      accessor: (user: UserType) => (
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-gray-400" />
          <span>{user.email}</span>
        </div>
      ),
      className: 'min-w-[250px]'
    },
    {
      header: 'Role',
      accessor: (user: UserType) => (
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-gray-400" />
          <Badge
            variant={user.role === 'admin' ? 'purple' : 'gray'}
          >
            {user.role}
          </Badge>
        </div>
      ),
      className: 'min-w-[120px]'
    },
    {
      header: 'Created At',
      accessor: (user: UserType) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      ),
      className: 'min-w-[150px]'
    },
  ];

  return (
    <BaseList<UserType>
      title="Users"
      basePath="/users"
      service={usersApi}
      columns={columns}
      sortOptions={[
        { value: '-createdAt', label: 'Newest First' },
        { value: 'createdAt', label: 'Oldest First' },
        { value: 'name', label: 'Name A-Z' },
        { value: '-name', label: 'Name Z-A' },
      ]}
      searchPlaceholder="Search users..."
      createButtonLabel="New User"
      emptyMessage="No users found"
    />
  );
};

export default UsersList;