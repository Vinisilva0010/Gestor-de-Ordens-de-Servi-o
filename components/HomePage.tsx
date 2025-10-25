
import React from 'react';
import { Button } from './Button';
import { PlusIcon } from './icons/PlusIcon';

interface HomePageProps {
  onCreateOrder: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCreateOrder }) => {
  return (
    <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
        Bem-vindo ao Gestor de Ordens de Serviço
      </h2>
      <p className="mt-4 text-lg text-zanvexis-text">
        Gerencie e acompanhe todas as ordens de serviço da produção de forma simples e eficiente.
      </p>
      <div className="mt-10">
        <Button onClick={onCreateOrder} className="text-lg">
          <PlusIcon className="w-6 h-6 mr-2" />
          Criar Ordem de Serviço
        </Button>
      </div>
      <div className="mt-16 text-left max-w-2xl mx-auto space-y-6 text-gray-300">
        <div className="bg-zanvexis-medium p-6 rounded-lg shadow-xl">
            <h3 className="font-bold text-lg text-zanvexis-accent">Funcionalidades Principais</h3>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Criação rápida de Ordens de Serviço (OS).</li>
                <li>Acompanhamento de status em tempo real.</li>
                <li>Filtros por departamento, status e prioridade.</li>
                <li>Geração de relatórios em PDF e CSV para transferências.</li>
                <li>Todos os dados são salvos localmente no seu navegador.</li>
            </ul>
        </div>
      </div>
    </div>
  );
};
