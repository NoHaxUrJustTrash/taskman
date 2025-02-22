import  { CheckSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { Task } from './types/task';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, priority: 'low' | 'medium' | 'high', dueDate: string | null) => {
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
        dueDate
      },
    ]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const taskId = e.currentTarget.getAttribute('data-task-id');
    if (taskId) {
      setDraggedTaskId(taskId);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, tasks: Task[]) => {
    e.preventDefault();
    const dropTaskId = e.currentTarget.getAttribute('data-task-id');
    
    if (draggedTaskId && dropTaskId && draggedTaskId !== dropTaskId) {
      const taskList = [...tasks];
      const draggedTaskIndex = taskList.findIndex(t => t.id === draggedTaskId);
      const dropTaskIndex = taskList.findIndex(t => t.id === dropTaskId);
      
      if (draggedTaskIndex !== -1 && dropTaskIndex !== -1) {
        const [draggedTask] = taskList.splice(draggedTaskIndex, 1);
        taskList.splice(dropTaskIndex, 0, draggedTask);
        setTasks(taskList);
      }
    }
    setDraggedTaskId(null);
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <CheckSquare className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        </div>
        
        <TaskInput onAdd={addTask} />

        <div className="mt-8 space-y-6">
          {incompleteTasks.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700">Tasks ({incompleteTasks.length})</h2>
              <div className="space-y-3">
                {incompleteTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    draggable={true}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, incompleteTasks)}
                  />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700">Completed ({completedTasks.length})</h2>
              <div className="space-y-3 opacity-75">
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    draggable={true}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, completedTasks)}
                  />
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No tasks yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
 