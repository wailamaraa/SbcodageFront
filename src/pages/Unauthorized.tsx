import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <ShieldAlert className="h-24 w-24 text-red-500 mx-auto" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Accès Refusé
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Vous n'avez pas l'autorisation d'accéder à cette page.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button variant="primary" size="lg">
              Aller au Tableau de Bord
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;