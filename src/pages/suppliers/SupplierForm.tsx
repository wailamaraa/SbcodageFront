import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { suppliersApi } from '../../services/api/suppliers';
import { Supplier } from '../../types';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SupplierForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    handleSubmit,
    handleInputChange
  } = useForm<Supplier>({
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/suppliers')}
          icon={<ArrowLeft size={20} />}
          className="flex-shrink-0"
        >
          Retour
        </Button>
        <div className="flex items-center gap-2">
          <Building2 size={24} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {id ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informations de Base</h3>
              
              <Input
                label="Nom de l'Entreprise *"
                name="name"
                value={data.name || ''}
                onChange={handleInputChange}
                required
                placeholder="Entrez le nom de l'entreprise fournisseur"
                className="w-full"
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={data.email || ''}
                onChange={handleInputChange}
                placeholder="Entrez l'adresse email du fournisseur"
                className="w-full"
              />

              <Input
                label="Personne de Contact"
                name="contactPerson"
                value={data.contactPerson || ''}
                onChange={handleInputChange}
                placeholder="Entrez le nom de la personne de contact principale"
                className="w-full"
              />
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Détails de Contact</h3>
              
              <Input
                label="Téléphone"
                name="phone"
                type="tel"
                value={data.phone || ''}
                onChange={handleInputChange}
                placeholder="Entrez le numéro de téléphone (ex: +212 6 12 34 56 78)"
                className="w-full"
              />

              <Input
                label="Adresse"
                name="address"
                value={data.address || ''}
                onChange={handleInputChange}
                placeholder="Entrez l'adresse complète de l'entreprise"
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
              placeholder="Entrez des notes supplémentaires sur ce fournisseur (conditions de paiement, préférences de livraison, etc.)"
              rows={4}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/suppliers')}
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
              {isLoading ? 'Enregistrement...' : id ? 'Mettre à Jour le Fournisseur' : 'Créer le Fournisseur'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SupplierForm;