import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import type { Task, TaskFormData, Status } from '../types/Task';
import TaskModal from '../components/TaskModal';
import Analytics from '../components/Analytics';

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    <div className="min-h-screen bg-[#FEF2F2] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Analytics refreshTrigger={refreshTrigger} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1F2937]">My Tasks</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#7F1D1D] hover:bg-[#991B1B] text-white px-4 py-2 rounded text-sm"
            >
              + Add Task
            </button>
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-[#7F1D1D]/10 border border-[#7F1D1D]/20 text-[#1F2937] px-4 py-2 rounded text-sm"
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
          <p className="text-[#1F2937]/60">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-[#1F2937]/60">No tasks yet. Create your first task!</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-lg border border-[#7F1D1D]/10"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[#1F2937] font-semibold">{task.title}</h3>
                    <p className="text-[#1F2937]/60 text-sm mt-1">{task.description}</p>
                    <p className="text-[#1F2937]/40 text-xs mt-2">
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
                      className="text-xs px-2 py-1 rounded bg-[#FEF2F2] text-[#1F2937] border border-[#7F1D1D]/20"
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