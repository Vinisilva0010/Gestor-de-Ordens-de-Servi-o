
export enum Status {
  Open = 'Aberta',
  InProgress = 'Em Andamento',
  Completed = 'Concluída',
  Cancelled = 'Cancelada',
}

export enum Priority {
  Low = 'Baixa',
  Medium = 'Média',
  High = 'Alta',
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  checklist?: ChecklistItem[];
}

export interface ServiceOrder {
  id: string;
  osNumber: string;
  client: string;
  description: string;
  priority: Priority;
  department: string;
  status: Status;
  createdAt: string;
  notes: Note[];
}
