import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import type { Task, TaskFormData, Status } from '../types/Task';
import TaskModal from '../components/TaskModal';
import Analytics from '../components/Analytics';
import { useTheme } from '../context/ThemeContext';

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data.tasks);
    } catch (err: any) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateTask = async (data: TaskFormData) => {
    await createTask(data);
    await fetchTasks();
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    try {
      await updateTask(taskId, { status: newStatus });
      await fetchTasks();
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError('Failed to update task status.');
    }
  };

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await deleteTask(taskId);
      await fetchTasks();
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF2F2] dark:bg-[#1C0808] px-4 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <Analytics refreshTrigger={refreshTrigger} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1F2937] dark:text-[#FEF2F2]">My Tasks</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#7F1D1D] hover:bg-[#991B1B] text-white px-4 py-2 rounded text-sm font-semibold transition"
            >
              + Add Task
            </button>
            <button
              onClick={toggleTheme}
              className="bg-white dark:bg-[#2D1212] hover:bg-[#7F1D1D]/10 dark:hover:bg-[#7F1D1D]/20 border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 text-[#1F2937] dark:text-[#FEF2F2] px-3 py-2 rounded text-sm flex items-center justify-center transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.066.066A5.002 5.002 0 0112 17a5.002 5.002 0 01-3.232-1.228l-.066-.066z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="bg-white dark:bg-[#2D1212] hover:bg-[#7F1D1D]/10 dark:hover:bg-[#7F1D1D]/20 border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 text-[#1F2937] dark:text-[#FEF2F2] px-4 py-2 rounded text-sm transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-[#DC2626]/10 border border-[#DC2626] text-[#DC2626] px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60">No tasks yet. Create your first task!</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white dark:bg-[#2D1212] p-4 rounded-lg border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#1F2937] dark:text-[#FEF2F2] font-semibold">{task.title}</h3>
                    <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm mt-1">{task.description}</p>
                    <p className="text-[#1F2937]/40 dark:text-[#FEF2F2]/40 text-xs mt-2">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-[#DC2626]/20 text-[#DC2626]">
                      {task.priority}
                    </span>

                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value as Status)}
                      className="text-xs px-2 py-1 rounded bg-[#FEF2F2] dark:bg-[#1C0808] text-[#1F2937] dark:text-[#FEF2F2] border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 focus:outline-none transition-colors"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-xs text-[#DC2626] hover:text-[#991B1B] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
}

export default Dashboard;