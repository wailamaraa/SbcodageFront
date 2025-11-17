import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Clock, ArrowLeft, Edit, Trash2, UserCheck, Calendar } from 'lucide-react';
import { usersApi } from '../../services/api/users';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const UserDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, handleDelete } = useDetails({
    service: usersApi,
    basePath: '/users',
    id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Utilisateur non trouvé</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/users')}
          icon={<ArrowLeft size={20} />}
        >
          Retour aux Utilisateurs
        </Button>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string): 'success' | 'info' | 'warning' | 'danger' | 'gray' => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'user':
        return 'info';
      default:
        return 'gray';
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'user':
        return 'Utilisateur';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/users')}
            icon={<ArrowLeft size={20} />}
            className="flex-shrink-0"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getRoleBadgeVariant(user.role)} className="flex-shrink-0">
                {getRoleLabel(user.role)}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/users/edit/${user._id}`)}
            icon={<Edit size={20} />}
            className="flex-1 sm:flex-none"
          >
            Modifier
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDelete()}
            icon={<Trash2 size={20} />}
            className="flex-1 sm:flex-none text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* User Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UserCheck size={20} className="text-blue-600 dark:text-blue-400" />
            Informations de l'Utilisateur
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nom Complet</p>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Adresse Email</p>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                <a 
                  href={`mailto:${user.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {user.email}
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rôle</p>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-gray-400" />
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} className="text-blue-600 dark:text-blue-400" />
            Informations du Compte
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date de Création</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="text-gray-900 dark:text-white text-sm">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')} à {new Date(user.createdAt).toLocaleTimeString('fr-FR')}
                </p>
              </div>
            </div>
            
            {user.updatedAt && user.updatedAt !== user.createdAt && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Dernière Modification</p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white text-sm">
                    {new Date(user.updatedAt).toLocaleDateString('fr-FR')} à {new Date(user.updatedAt).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Permissions</p>
              <div className="space-y-2">
                {user.role === 'admin' && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-900 dark:text-white">Accès administrateur complet</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-900 dark:text-white">Accès aux fonctionnalités de base</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;