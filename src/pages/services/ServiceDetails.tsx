import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Tag, FileText, ArrowLeft, Edit, Trash2, Settings, Calendar } from 'lucide-react';
import { servicesApi } from '../../services/api/services';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';

const ServiceDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, handleDelete } = useDetails({
    service: servicesApi,
    basePath: '/services',
    id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <Settings size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Service non trouvé</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/services')}
          icon={<ArrowLeft size={20} />}
        >
          Retour aux Services
        </Button>
      </div>
    );
  }

  const getCategoryInfo = (category: string) => {
    const categoryConfig = {
      repair: { label: 'Réparation', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      maintenance: { label: 'Maintenance', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      bodywork: { label: 'Carrosserie', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      diagnostic: { label: 'Diagnostic', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      other: { label: 'Autre', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
    };
    return categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;
  };

  const categoryInfo = getCategoryInfo(service.category);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/services')}
            icon={<ArrowLeft size={20} />}
            className="flex-shrink-0"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {service.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={service.status === 'active' ? 'success' : 'gray'} className="flex-shrink-0">
                {service.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                <Tag size={12} />
                {categoryInfo.label}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/services/edit/${service._id}`)}
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
        {/* Service Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings size={20} className="text-blue-600 dark:text-blue-400" />
            Informations du Service
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nom du Service</p>
              <p className="text-gray-900 dark:text-white font-medium">{service.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prix</p>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(service.price)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Durée</p>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {service.duration}h
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Catégorie</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                <Tag size={14} />
                {categoryInfo.label}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Statut</p>
              <Badge variant={service.status === 'active' ? 'success' : 'gray'}>
                {service.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
            Informations Complémentaires
          </h2>
          <div className="space-y-4">
            {service.description && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</p>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date de Création</p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white text-sm">
                    {service.createdAt ? new Date(service.createdAt).toLocaleDateString('fr-FR') : '-'}
                  </p>
                </div>
              </div>
              
              {service.updatedAt && service.updatedAt !== service.createdAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Dernière Modification</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="text-gray-900 dark:text-white text-sm">
                      {new Date(service.updatedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ServiceDetails; 