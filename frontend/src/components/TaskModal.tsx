import { useState } from 'react';
import type { TaskFormData, Priority, Status } from '../types/Task';

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

function TaskModal({ onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('To Do');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({ title, description, dueDate, priority, status });
      onClose();
    } catch (err: any) {
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-[#2D1212] p-6 rounded-lg border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 w-full max-w-md transition-all duration-200">
        <h2 className="text-xl font-bold text-[#1F2937] dark:text-[#FEF2F2] mb-4">Create New Task</h2>

        {error && (
          <div className="bg-[#DC2626]/10 border border-[#DC2626] text-[#DC2626] px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#FEF2F2] dark:bg-[#1C0808] text-[#1F2937] dark:text-[#FEF2F2] border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 focus:outline-none focus:border-[#7F1D1D] dark:focus:border-[#DC2626] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded bg-[#FEF2F2] dark:bg-[#1C0808] text-[#1F2937] dark:text-[#FEF2F2] border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 focus:outline-none focus:border-[#7F1D1D] dark:focus:border-[#DC2626] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#FEF2F2] dark:bg-[#1C0808] text-[#1F2937] dark:text-[#FEF2F2] border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 focus:outline-none focus:border-[#7F1D1D] dark:focus:border-[#DC2626] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded bg-[#FEF2F2] dark:bg-[#1C0808] text-[#1F2937] dark:text-[#FEF2F2] border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 focus:outline-none focus:border-[#7F1D1D] dark:focus:border-[#DC2626] transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 rounded bg-[#FEF2F2] dark:bg-[#1C0808] text-[#1F2937] dark:text-[#FEF2F2] border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 focus:outline-none focus:border-[#7F1D1D] dark:focus:border-[#DC2626] transition-colors"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white dark:bg-[#2D1212] hover:bg-[#7F1D1D]/10 dark:hover:bg-[#7F1D1D]/20 border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 text-[#1F2937] dark:text-[#FEF2F2] py-2 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#7F1D1D] hover:bg-[#991B1B] text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;