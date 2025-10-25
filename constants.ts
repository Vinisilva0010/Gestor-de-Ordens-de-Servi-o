
import { Status, Priority } from './types';

export const DEPARTMENTS = ['Manutenção', 'Produção', 'Engenharia', 'Qualidade', 'Logística'];
export const PRIORITIES = [Priority.Low, Priority.Medium, Priority.High];
export const STATUSES = [Status.Open, Status.InProgress, Status.Completed, Status.Cancelled];

export const STATUS_COLORS: { [key in Status]: string } = {
  [Status.Open]: 'bg-blue-500',
  [Status.InProgress]: 'bg-yellow-500',
  [Status.Completed]: 'bg-green-500',
  [Status.Cancelled]: 'bg-red-500',
};

export const PRIORITY_COLORS: { [key in Priority]: string } = {
    [Priority.Low]: 'bg-gray-500',
    [Priority.Medium]: 'bg-orange-500',
    [Priority.High]: 'bg-rose-600',
}
