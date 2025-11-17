import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car as CarIcon, User, Calendar, FileText, Clock, ArrowLeft, Edit, Trash2, Mail, Phone, Hash } from 'lucide-react';
import { carsApi } from '../../services/api/cars';
import { useDetails } from '../../hooks/useDetails';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CarDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: car, isLoading, handleDelete } = useDetails({
    service: carsApi,
    basePath: '/vehicles',
    id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-8">
        <CarIcon size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Véhicule non trouvé</h3>
        <Button
          variant="primary"
          onClick={() => navigate('/vehicles')}
          icon={<ArrowLeft size={20} />}
        >
          Retour aux Véhicules
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
            onClick={() => navigate('/vehicles')}
            icon={<ArrowLeft size={20} />}
            className="flex-shrink-0"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {car.make} {car.model}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{car.year} • {car.licensePlate || 'Aucune Plaque'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/vehicles/edit/${car._id}`)}
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
        {/* Vehicle Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations du Véhicule</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CarIcon size={16} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Marque</h3>
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{car.make}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CarIcon size={16} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Modèle</h3>
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{car.model}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Année</h3>
                </div>
                <p className="text-gray-900 dark:text-white">{car.year}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</h3>
                </div>
                <Badge variant={car.status === 'active' ? 'success' : 'gray'}>
                  {(car.status || 'inactive').charAt(0).toUpperCase() + (car.status || 'inactive').slice(1)}
                </Badge>
              </div>
            </div>

            {car.licensePlate && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Plaque d'Immatriculation</h3>
                </div>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono">
                  {car.licensePlate}
                </p>
              </div>
            )}

            {car.vin && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">VIN</h3>
                </div>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-2 rounded font-mono text-sm">
                  {car.vin}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Owner Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations du Propriétaire</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom</h3>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{car.owner.name}</p>
            </div>

            {car.owner.email && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                </div>
                <p className="text-gray-900 dark:text-white">
                  <a 
                    href={`mailto:${car.owner.email}`} 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {car.owner.email}
                  </a>
                </p>
              </div>
            )}

            {car.owner.phone && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Téléphone</h3>
                </div>
                <p className="text-gray-900 dark:text-white">
                  <a 
                    href={`tel:${car.owner.phone}`} 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {car.owner.phone}
                  </a>
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Actions Rapides</h3>
              <div className="space-y-2">
                {car.owner.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${car.owner.email}`, '_blank')}
                    icon={<Mail size={16} />}
                    className="w-full justify-start"
                  >
                    Envoyer un Email
                  </Button>
                )}
                {car.owner.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${car.owner.phone}`, '_blank')}
                    icon={<Phone size={16} />}
                    className="w-full justify-start"
                  >
                    Appeler le Propriétaire
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Service Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Historique des Services</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernier Service</h3>
              </div>
              <p className="text-gray-900 dark:text-white">
                {car.lastService ? new Date(car.lastService).toLocaleDateString() : 'Aucun service enregistré'}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prochain Service Dû</h3>
              </div>
              <p className="text-gray-900 dark:text-white">
                {car.nextService ? new Date(car.nextService).toLocaleDateString() : 'Non programmé'}
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Supplémentaires</h2>
          <div className="space-y-4">
            {car.notes && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
                </div>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg whitespace-pre-wrap">
                  {car.notes}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Créé</h3>
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(car.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière Mise à Jour</h3>
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(car.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CarDetails; 