import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Car as CarIcon } from 'lucide-react';
import { carsApi } from '../../services/api/cars';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Car } from '../../types';

const CarForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, handleSubmit, handleInputChange } = useForm<Car>({
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/vehicles')}
          icon={<ArrowLeft size={20} />}
          className="flex-shrink-0"
        >
          Back
        </Button>
        <div className="flex items-center gap-2">
          <CarIcon size={24} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {id ? 'Edit Vehicle' : 'New Vehicle'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations du Véhicule</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Marque *"
                  name="make"
                  value={data.make || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: Toyota, Honda, Ford"
                  className="w-full"
                />

                <Input
                  label="Modèle *"
                  name="model"
                  value={data.model || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="ex: Camry, Civic, F-150"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Année *"
                  name="year"
                  type="number"
                  value={data.year || new Date().getFullYear()}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 2}
                  className="w-full"
                />

                <Select
                  label="Statut"
                  name="status"
                  value={data.status || 'active'}
                  onChange={handleInputChange}
                  options={[
                    { value: 'active', label: 'Actif' },
                    { value: 'inactive', label: 'Inactif' }
                  ]}
                  className="w-full"
                />
              </div>

              <Input
                label="Plaque d'Immatriculation"
                name="licensePlate"
                value={data.licensePlate || ''}
                onChange={handleInputChange}
                placeholder="ex: ABC-1234"
                className="w-full"
              />

              <Input
                label="VIN (Numéro d'Identification du Véhicule)"
                name="vin"
                value={data.vin || ''}
                onChange={handleInputChange}
                placeholder="VIN à 17 caractères"
                maxLength={17}
                className="w-full"
              />
            </div>

            {/* Owner Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations du Propriétaire</h3>
              
              <Input
                label="Nom du Propriétaire *"
                name="owner.name"
                value={data.owner?.name || ''}
                onChange={handleInputChange}
                required
                placeholder="Nom complet du propriétaire du véhicule"
                className="w-full"
              />

              <Input
                label="Email"
                name="owner.email"
                type="email"
                value={data.owner?.email || ''}
                onChange={handleInputChange}
                placeholder="proprietaire@exemple.com"
                className="w-full"
              />

              <Input
                label="Téléphone"
                name="owner.phone"
                type="tel"
                value={data.owner?.phone || ''}
                onChange={handleInputChange}
                placeholder="Numéro de téléphone"
                className="w-full"
              />
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <TextArea
              label="Notes"
              name="notes"
              value={data.notes || ''}
              onChange={handleInputChange}
              placeholder="Notes supplémentaires sur ce véhicule (historique d'entretien, exigences spéciales, etc.)"
              rows={4}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vehicles')}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              icon={<Save size={20} />}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? 'Enregistrement...' : id ? 'Mettre à Jour le Véhicule' : 'Créer le Véhicule'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CarForm; 