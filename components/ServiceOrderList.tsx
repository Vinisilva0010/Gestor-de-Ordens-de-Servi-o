
import React, { useState, useMemo } from 'react';
import { ServiceOrder, Status, Priority } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS, DEPARTMENTS, PRIORITIES, STATUSES } from '../constants';
import { Button } from './Button';
import { exportToCsv, exportAllToPdf } from '../services/exportService';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ServiceOrderListProps {
  orders: ServiceOrder[];
  onSelectOrder: (id: string) => void;
  onCreateOrder: () => void;
}

const FilterDropdown = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
    <div>
        <label className="text-sm font-medium text-zanvexis-text">{label}</label>
        <select value={value} onChange={onChange} className="mt-1 w-full px-3 py-2 bg-zanvexis-light border border-gray-600 rounded-md focus:ring-zanvexis-accent focus:border-zanvexis-accent text-white">
            <option value="">Todos</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export const ServiceOrderList: React.FC<ServiceOrderListProps> = ({ orders, onSelectOrder, onCreateOrder }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const filteredOrders = useMemo(() => {
    return orders
      .filter(os => !statusFilter || os.status === statusFilter)
      .filter(os => !priorityFilter || os.priority === priorityFilter)
      .filter(os => !departmentFilter || os.department === departmentFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, statusFilter, priorityFilter, departmentFilter]);

  const handleExportCSV = () => {
    exportToCsv(filteredOrders, 'relatorio_filtrado.csv');
  };

  const handleExportPDF = () => {
    exportAllToPdf(filteredOrders);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Ordens de Serviço</h2>
        <div className="flex items-center gap-2">
           <Button onClick={onCreateOrder} variant="primary">
             <PlusIcon className="w-5 h-5 mr-2"/> Nova OS
           </Button>
        </div>
      </div>
      
      <div className="bg-zanvexis-medium p-4 rounded-lg mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <h3 className="text-lg font-semibold text-white md:col-span-2 lg:col-span-1 lg:self-center">Filtros</h3>
            <FilterDropdown label="Status" options={STATUSES} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
            <FilterDropdown label="Prioridade" options={PRIORITIES} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} />
            <FilterDropdown label="Departamento" options={DEPARTMENTS} value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} />
          </div>
          {filteredOrders.length > 0 && (
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleExportCSV} variant="accent" className="px-3 py-2 text-sm">
                <DownloadIcon className="w-4 h-4 mr-1"/> CSV
              </Button>
              <Button onClick={handleExportPDF} variant="accent" className="px-3 py-2 text-sm">
                <DownloadIcon className="w-4 h-4 mr-1"/> PDF
              </Button>
            </div>
          )}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(os => (
            <div key={os.id} onClick={() => onSelectOrder(os.id)} className="bg-zanvexis-medium rounded-lg shadow-xl cursor-pointer hover:ring-2 hover:ring-zanvexis-accent transition-all duration-200 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-bold text-lg text-white">{os.osNumber}</span>
                  <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${PRIORITY_COLORS[os.priority]}`}>{os.priority}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{os.department}</p>
                <p className="font-semibold text-zanvexis-text mt-2">{os.client}</p>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2 h-10">{os.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-zanvexis-light flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[os.status]}`}></span>
                    <span className="text-sm font-medium text-white">{os.status}</span>
                 </div>
                 <span className="text-xs text-gray-400">{new Date(os.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-zanvexis-medium rounded-lg">
          <h3 className="text-xl font-semibold text-white">Nenhuma Ordem de Serviço Encontrada</h3>
          <p className="mt-2 text-gray-400">Tente ajustar os filtros ou crie uma nova OS.</p>
        </div>
      )}
    </div>
  );
};
