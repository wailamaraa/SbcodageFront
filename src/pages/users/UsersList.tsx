import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Mail, Clock, Plus, Search, Filter, Edit, Trash2, UserCheck } from 'lucide-react';
import { usersApi } from '../../services/api/users';
import { User as UserType } from '../../types';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useCrud } from '../../hooks/useCrud';

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [roleFilter, setRoleFilter] = useState('');

  const {
    items: users,
    total,
    currentPage,
    totalPages,
    isLoading,
    loadItems: loadUsers,
    deleteItem: deleteUser
  } = useCrud<UserType>({
    service: usersApi,
    basePath: '/users'
  });

  useEffect(() => {
    const params = {
      page,
      limit: pageSize,
      sort,
      ...(search && { search }),
      ...(roleFilter && { role: roleFilter })
    };
    loadUsers(params);
  }, [loadUsers, page, pageSize, search, sort, roleFilter]);

  // Sync page state when currentPage changes from API response
  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Utilisateurs</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/users/new')}
          icon={<Plus size={20} />}
          className="w-full sm:w-auto"
        >
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Input
              placeholder="Rechercher des utilisateurs..."
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value); }}
              className="pl-10"
              icon={<Search size={20} className="text-gray-400" />}
            />
          </div>
          <Select
            value={roleFilter}
            onChange={e => { setPage(1); setRoleFilter(e.target.value); }}
            options={[
              { value: '', label: 'Tous les Rôles' },
              { value: 'admin', label: 'Administrateur' },
              { value: 'user', label: 'Utilisateur' }
            ]}
            icon={<Shield size={20} className="text-gray-400" />}
          />
          <Select
            value={sort}
            onChange={e => { setPage(1); setSort(e.target.value); }}
            options={[
              { value: '-createdAt', label: 'Plus Récent' },
              { value: 'createdAt', label: 'Plus Ancien' },
              { value: 'name', label: 'Nom A-Z' },
              { value: '-name', label: 'Nom Z-A' },
              { value: 'email', label: 'Email A-Z' },
              { value: '-email', label: 'Email Z-A' }
            ]}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <Select
            value={pageSize.toString()}
            onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}
            options={[6, 12, 24, 48].map(size => ({ value: size.toString(), label: `${size} par page` }))}
            icon={<Filter size={20} className="text-gray-400" />}
          />
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            Total: {total} utilisateurs
          </div>
        </div>
      </Card>

      {/* Users Grid - Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <div 
            key={user._id} 
            className="cursor-pointer"
            onClick={() => navigate(`/users/${user._id}`)}
          >
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow h-full">
              {/* Header with Role */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <UserCheck size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                  </div>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)} className="flex-shrink-0">
                  {getRoleLabel(user.role)}
                </Badge>
              </div>

              {/* Email */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Rôle:</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Créé le:</span>
                  <span className="text-xs text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/users/edit/${user._id}`);
                  }}
                  icon={<Edit size={14} />}
                  className="flex-1 text-xs"
                >
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUser(user._id);
                  }}
                  icon={<Trash2 size={14} />}
                  className="flex-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Supprimer
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <Card className="p-8 text-center">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? 'Essayez d\'ajuster vos critères de recherche' : 'Commencez par créer votre premier utilisateur'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/users/new')}
            icon={<Plus size={20} />}
          >
            Créer le Premier Utilisateur
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {users.length} sur {total} utilisateurs
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                Précédent
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1"
              >
                Suivant
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UsersList;