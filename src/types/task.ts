export  interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastEdited?: string;
  dueDate: string | null;
}
 