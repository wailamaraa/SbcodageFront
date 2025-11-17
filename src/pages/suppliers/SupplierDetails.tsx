import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Clock, FileText, ArrowLeft, Edit, Trash2, User } from 'lucide-react';
import { suppliersApi } from '../../services/api/suppliers';
import { useDetails } from '../../hooks/useDetails';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SupplierDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: supplier, isLoading, handleDelete } = useDetails({
    service: suppliersApi,
    basePath: '/suppliers',
    id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center py-8">
        <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Fournisseur non trouvé</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/suppliers')}
          icon={<ArrowLeft size={20} />}
        >
          Retour aux Fournisseurs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/suppliers')}
            icon={<ArrowLeft size={20} />}
            className="flex-shrink-0"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{supplier.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">Détails du Fournisseur</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/suppliers/edit/${supplier._id}`)}
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
        {/* Contact Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations de Contact</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom de l'Entreprise</h3>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{supplier.name}</p>
            </div>

            {supplier.email && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                </div>
                <p className="text-gray-900 dark:text-white">
                  <a 
                    href={`mailto:${supplier.email}`} 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {supplier.email}
                  </a>
                </p>
              </div>
            )}

            {supplier.contactPerson && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Personne de Contact</h3>
                </div>
                <p className="text-gray-900 dark:text-white">{supplier.contactPerson}</p>
              </div>
            )}

            {supplier.phone && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Téléphone</h3>
                </div>
                <p className="text-gray-900 dark:text-white">
                  <a 
                    href={`tel:${supplier.phone}`} 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {supplier.phone}
                  </a>
                </p>
              </div>
            )}

            {supplier.address && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresse</h3>
                </div>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {supplier.address}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Supplémentaires</h2>
          <div className="space-y-4">
            {supplier.notes && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
                </div>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg whitespace-pre-wrap">
                  {supplier.notes}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Créé</h3>
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(supplier.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière Mise à Jour</h3>
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(supplier.updatedAt).toLocaleString()}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Actions Rapides</h3>
              <div className="space-y-2">
                {supplier.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${supplier.email}`, '_blank')}
                    icon={<Mail size={16} />}
                    className="w-full justify-start"
                  >
                    Envoyer un Email
                  </Button>
                )}
                {supplier.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${supplier.phone}`, '_blank')}
                    icon={<Phone size={16} />}
                    className="w-full justify-start"
                  >
                    Appeler
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDetails;