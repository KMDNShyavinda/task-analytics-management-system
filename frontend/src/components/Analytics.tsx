import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { getAnalyticsSummary } from '../services/analyticsService';
import type { AnalyticsSummary } from '../services/analyticsService';

const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#22c55e'];
const PRIORITY_COLORS = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444' };

interface AnalyticsProps {
  refreshTrigger: number;
}

function Analytics({ refreshTrigger }: AnalyticsProps) {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getAnalyticsSummary();
        setData(result);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [refreshTrigger]);

  if (loading) {
    return <p className="text-slate-400">Loading analytics...</p>;
  }

  if (!data) {
    return <p className="text-slate-400">No analytics data available.</p>;
  }

  const statusData = Object.entries(data.statusBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const priorityData = Object.entries(data.priorityBreakdown).map(([name, value]) => ({
    name,
    value,
    fill: PRIORITY_COLORS[name as keyof typeof PRIORITY_COLORS],
  }));

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Total Active Tasks</p>
          <p className="text-3xl font-bold text-white mt-1">{data.totalActiveTasks}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Completed Today</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{data.completedToday}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Overdue</p>
          <p className="text-3xl font-bold text-red-400 mt-1">{data.overdue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-white font-semibold mb-3">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-white font-semibold mb-3">Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;