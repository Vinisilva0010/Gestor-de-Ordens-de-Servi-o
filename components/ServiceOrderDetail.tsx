
import React, { useState } from 'react';
import { ServiceOrder, Status, Note, ChecklistItem } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS, STATUSES } from '../constants';
import { Button } from './Button';
import { exportOrderToPdf } from '../services/exportService';
import { DownloadIcon } from './icons/DownloadIcon';
import { ArrowUturnLeftIcon } from './icons/ArrowUturnLeftIcon';

interface ServiceOrderDetailProps {
  order: ServiceOrder;
  onUpdateOrder: (updatedOrder: ServiceOrder) => void;
  onBack: () => void;
}

export const ServiceOrderDetail: React.FC<ServiceOrderDetailProps> = ({ order, onUpdateOrder, onBack }) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  const [currentChecklistItems, setCurrentChecklistItems] = useState<ChecklistItem[]>([]);

  const handleStatusChange = (newStatus: Status) => {
    onUpdateOrder({ ...order, status: newStatus });
  };

  const handleToggleChecklistItem = (noteId: string, itemId: string) => {
    const updatedOrder = JSON.parse(JSON.stringify(order)); // Deep copy to avoid mutation issues
    const note = updatedOrder.notes.find((n: Note) => n.id === noteId);
    if (note && note.checklist) {
        const item = note.checklist.find((i: ChecklistItem) => i.id === itemId);
        if (item) {
            item.completed = !item.completed;
            onUpdateOrder(updatedOrder);
        }
    }
  };

  const handleAddNewChecklistItem = () => {
    if (newChecklistItemText.trim() === '') return;
    const newItem: ChecklistItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        text: newChecklistItemText,
        completed: false,
    };
    setCurrentChecklistItems([...currentChecklistItems, newItem]);
    setNewChecklistItemText('');
  };

  const handleAddNote = () => {
    if (newNoteText.trim() === '') {
        alert("O texto da nota ou título do checklist não pode estar vazio.");
        return;
    }
    const note: Note = {
      id: `note-${Date.now()}`,
      text: newNoteText,
      createdAt: new Date().toISOString(),
      ...(currentChecklistItems.length > 0 && { checklist: currentChecklistItems }),
    };
    onUpdateOrder({ ...order, notes: [...order.notes, note] });
    
    // Reset form
    setNewNoteText('');
    setCurrentChecklistItems([]);
    setNewChecklistItemText('');
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('pt-BR');

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white">{order.osNumber}</h2>
                <p className="text-gray-400">Criada em: {formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <Button onClick={onBack} variant="secondary"><ArrowUturnLeftIcon className="w-5 h-5 mr-2" /> Voltar</Button>
                <Button onClick={() => exportOrderToPdf(order)} variant="accent"><DownloadIcon className="w-5 h-5 mr-2" /> Exportar PDF</Button>
            </div>
        </div>

        <div className="bg-zanvexis-medium rounded-lg shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-400">Cliente/Solicitante</h3>
                    <p className="mt-1 text-lg text-white">{order.client}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400">Departamento</h3>
                    <p className="mt-1 text-lg text-white">{order.department}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400">Prioridade</h3>
                    <p className="mt-1 flex items-center gap-2">
                        <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${PRIORITY_COLORS[order.priority]}`}>{order.priority}</span>
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-400">Status Atual</h3>
                    <p className="mt-1 flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full ${STATUS_COLORS[order.status]}`}></span>
                        <span className="text-lg font-bold text-white">{order.status}</span>
                    </p>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-400">Descrição do Serviço</h3>
                    <p className="mt-1 text-white whitespace-pre-wrap">{order.description}</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zanvexis-light">
                <h3 className="text-lg font-semibold text-white">Alterar Status</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => handleStatusChange(s)} disabled={order.status === s} className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${order.status === s ? STATUS_COLORS[s] : 'bg-zanvexis-light hover:bg-gray-600'}`}>{s}</button>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Notas e Histórico</h3>
            <div className="bg-zanvexis-medium rounded-lg shadow-xl p-6">
                <div className="space-y-4">
                    {order.notes.length > 0 ? [...order.notes].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(note => (
                        <div key={note.id} className="p-4 bg-zanvexis-dark rounded-md">
                            <p className="text-white whitespace-pre-wrap font-semibold">{note.text}</p>
                             {note.checklist && note.checklist.length > 0 && (
                                <div className="mt-3 pl-2 border-l-2 border-zanvexis-light">
                                    <ul className="space-y-2">
                                        {note.checklist.map(item => (
                                            <li key={item.id} className="flex items-center ml-2">
                                                <input
                                                    type="checkbox"
                                                    id={`item-${item.id}`}
                                                    checked={item.completed}
                                                    onChange={() => handleToggleChecklistItem(note.id, item.id)}
                                                    className="h-5 w-5 rounded border-gray-500 text-zanvexis-accent bg-zanvexis-light focus:ring-zanvexis-accent cursor-pointer"
                                                />
                                                <label htmlFor={`item-${item.id}`} className={`ml-3 text-white cursor-pointer ${item.completed ? 'line-through text-gray-400' : ''}`}>
                                                    {item.text}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-2 text-right">{formatDate(note.createdAt)}</p>
                        </div>
                    )) : <p className="text-gray-400">Nenhuma nota adicionada ainda.</p>}
                </div>

                <div className="mt-6 pt-6 border-t border-zanvexis-light">
                     <h4 className="text-lg font-semibold text-white mb-2">Adicionar Nota / Checklist</h4>
                      <label htmlFor="note-text" className="text-sm font-medium text-zanvexis-text">Texto da Nota / Título do Checklist</label>
                     <textarea id="note-text" value={newNoteText} onChange={e => setNewNoteText(e.target.value)} rows={3} placeholder="Digite o texto principal da nota aqui..." className="w-full mt-1 px-4 py-2 bg-zanvexis-dark border border-gray-600 rounded-md focus:ring-zanvexis-accent focus:border-zanvexis-accent text-white"></textarea>

                    {currentChecklistItems.length > 0 && (
                        <div className="mt-4 p-3 bg-zanvexis-dark rounded-md">
                            <h5 className="text-sm font-semibold text-gray-300 mb-2">Itens do Checklist a adicionar:</h5>
                            <ul className="space-y-1 list-disc list-inside">
                                {currentChecklistItems.map(item => (
                                    <li key={item.id} className="text-gray-200">{item.text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="mt-4 flex items-center gap-3">
                        <input
                            type="text"
                            value={newChecklistItemText}
                            onChange={(e) => setNewChecklistItemText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewChecklistItem(); }}}
                            placeholder="Adicionar item ao checklist..."
                            className="flex-grow px-4 py-2 bg-zanvexis-dark border border-gray-600 rounded-md focus:ring-zanvexis-accent focus:border-zanvexis-accent text-white"
                        />
                         <Button onClick={handleAddNewChecklistItem} variant="secondary" className="px-4 !py-2 text-sm">Adicionar Item</Button>
                    </div>

                     <div className="mt-4 text-right">
                        <Button onClick={handleAddNote}>Salvar Nota</Button>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};
