import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User as UserIcon, Mail, Shield, Lock } from 'lucide-react';
import { usersApi } from '../../services/api/users';
import { User } from '../../types';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const UserForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const {
    data,
    isLoading,
    handleSubmit,
    handleInputChange
  } = useForm<User>({
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/users')}
          icon={<ArrowLeft size={20} />}
          className="flex-shrink-0"
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* User Information */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserIcon size={20} className="text-blue-600 dark:text-blue-400" />
              Informations de l'Utilisateur
            </h2>
            <div className="space-y-4">
              <Input
                label="Nom Complet"
                name="name"
                value={data.name || ''}
                onChange={handleInputChange}
                required
                placeholder="Entrez le nom complet"
                icon={<UserIcon size={20} className="text-gray-400" />}
              />

              <Input
                label="Adresse Email"
                name="email"
                type="email"
                value={data.email || ''}
                onChange={handleInputChange}
                required
                placeholder="Entrez l'adresse email"
                icon={<Mail size={20} className="text-gray-400" />}
              />

              <Select
                label="Rôle"
                name="role"
                value={data.role || ''}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Sélectionnez un rôle' },
                  { value: 'user', label: 'Utilisateur' },
                  { value: 'admin', label: 'Administrateur' }
                ]}
                icon={<Shield size={20} className="text-gray-400" />}
              />
            </div>
          </Card>

          {/* Security Information */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock size={20} className="text-blue-600 dark:text-blue-400" />
              Sécurité
            </h2>
            <div className="space-y-4">
              {!isEditing && (
                <Input
                  label="Mot de Passe"
                  name="password"
                  type="password"
                  value={data.password || ''}
                  onChange={handleInputChange}
                  required={!isEditing}
                  placeholder="Entrez le mot de passe"
                  icon={<Lock size={20} className="text-gray-400" />}
                />
              )}

              {isEditing && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={16} className="text-yellow-600 dark:text-yellow-400" />
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Modification du Mot de Passe
                    </p>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Le mot de passe ne peut pas être modifié via ce formulaire. 
                    L'utilisateur doit utiliser la fonction de réinitialisation du mot de passe.
                  </p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Permissions par Rôle
                  </p>
                </div>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <p><strong>Utilisateur:</strong> Accès aux fonctionnalités de base</p>
                  <p><strong>Administrateur:</strong> Accès complet au système</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/users')}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={20} />}
              className="w-full sm:w-auto"
            >
              {isEditing ? 'Mettre à Jour' : 'Créer l\'Utilisateur'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default UserForm;