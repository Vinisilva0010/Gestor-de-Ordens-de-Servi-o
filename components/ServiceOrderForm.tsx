
import React, { useState } from 'react';
import { ServiceOrder, Priority, Status } from '../types';
import { DEPARTMENTS, PRIORITIES } from '../constants';
import { Button } from './Button';

interface ServiceOrderFormProps {
  onSave: (order: ServiceOrder) => void;
  onCancel: () => void;
}

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ onSave, onCancel }) => {
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !description) {
        alert("Por favor, preencha o cliente e a descrição.");
        return;
    }

    const newOrder: ServiceOrder = {
      id: `os-${Date.now()}`,
      osNumber: `OS-${Date.now().toString(36).substr(2, 5).toUpperCase()}`,
      client,
      description,
      priority,
      department,
      status: Status.Open,
      createdAt: new Date().toISOString(),
      notes: [],
    };
    onSave(newOrder);
  };

  const inputClasses = "w-full px-4 py-2 bg-zanvexis-light border border-gray-600 rounded-md focus:ring-zanvexis-accent focus:border-zanvexis-accent text-white";

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Criar Nova Ordem de Serviço</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="client" className="block text-sm font-medium text-zanvexis-text mb-1">Cliente / Solicitante</label>
                <input type="text" id="client" value={client} onChange={e => setClient(e.target.value)} className={inputClasses} required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-zanvexis-text mb-1">Descrição do Serviço</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputClasses} required></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-zanvexis-text mb-1">Prioridade</label>
                    <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Priority)} className={inputClasses}>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-zanvexis-text mb-1">Departamento Designado</label>
                    <select id="department" value={department} onChange={e => setDepartment(e.target.value)} className={inputClasses}>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar Ordem</Button>
            </div>
        </form>
    </div>
  );
};
