import  { Calendar, CheckCircle2, Circle, GripVertical, Pencil, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const getDayOfWeek = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  onEdit,
  draggable,
  onDragStart,
  onDragOver,
  onDrop
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  };

  const handleSave = () => {
    onEdit(task.id, {
      title: editedTitle,
      priority: editedPriority,
      dueDate: editedDueDate || null,
      lastEdited: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedPriority(task.priority);
    setEditedDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div 
      className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${draggable ? 'cursor-move' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-task-id={task.id}
    >
      <div className="flex items-center space-x-4 flex-1">
        {draggable && (
          <GripVertical className="w-5 h-5 text-gray-400" />
        )}
        <button
          onClick={() => onToggle(task.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
        
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-2 py-1 text-lg border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              />
            </div>
            <div className="text-xs text-gray-500">
              Created: {new Date(task.createdAt).toLocaleString()}
              {task.lastEdited && ` • Last edited: ${new Date(task.lastEdited).toLocaleString()}`}
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <h3 className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className={`flex items-center text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()} ({getDayOfWeek(task.dueDate)})
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-600 transition-colors"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
 