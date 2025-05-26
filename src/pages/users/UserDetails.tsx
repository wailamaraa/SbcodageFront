import React from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Shield, Clock } from 'lucide-react';
import { usersApi } from '../../services/api/users';
import { BaseDetails } from '../../components/common/BaseDetails';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';

const UserDetails: React.FC = () => {
  const { id = '' } = useParams();
  const { data: user, isLoading, handleDelete } = useDetails({
    service: usersApi,
    basePath: '/users',
    id
  });

  if (!user && !isLoading) {
    return null;
  }

  return (
    <BaseDetails
      title={user?.name || 'User Details'}
      basePath="/users"
      data={user!}
      isLoading={isLoading}
      onDelete={handleDelete}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
          </div>
          <p className="text-gray-900 dark:text-white">{user?.name}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
          </div>
          <p className="text-gray-900 dark:text-white">{user?.email}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h3>
          </div>
          <Badge variant={user?.role === 'admin' ? 'purple' : 'gray'}>
            {user?.role}
          </Badge>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {user?.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</h3>
          </div>
          <p className="text-gray-900 dark:text-white">
            {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}
          </p>
        </div>
      </div>
    </BaseDetails>
  );
};

export default UserDetails;