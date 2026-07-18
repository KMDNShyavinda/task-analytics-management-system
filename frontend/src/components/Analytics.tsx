import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { getAnalyticsSummary } from '../services/analyticsService';
import type { AnalyticsSummary } from '../services/analyticsService';
import { useTheme } from '../context/ThemeContext';

const STATUS_COLORS = ['#DC2626', '#7F1D1D', '#991B1B'];
const PRIORITY_COLORS = { Low: '#991B1B', Medium: '#DC2626', High: '#7F1D1D' };

interface AnalyticsProps {
  refreshTrigger: number;
}

function Analytics({ refreshTrigger }: AnalyticsProps) {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

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
    return <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60">Loading analytics...</p>;
  }

  if (!data) {
    return <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60">No analytics data available.</p>;
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

  const axisStroke = theme === 'dark' ? '#FEF2F2' : '#1F2937';

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#2D1212] p-4 rounded-lg border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 transition-all duration-200">
          <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm">Total Active Tasks</p>
          <p className="text-3xl font-bold text-[#1F2937] dark:text-[#FEF2F2] mt-1">{data.totalActiveTasks}</p>
        </div>
        <div className="bg-white dark:bg-[#2D1212] p-4 rounded-lg border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 transition-all duration-200">
          <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm">Completed Today</p>
          <p className="text-3xl font-bold text-[#991B1B] dark:text-[#EE5E5E] mt-1">{data.completedToday}</p>
        </div>
        <div className="bg-white dark:bg-[#2D1212] p-4 rounded-lg border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 transition-all duration-200">
          <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm">Overdue</p>
          <p className="text-3xl font-bold text-[#DC2626] dark:text-[#F87171] mt-1">{data.overdue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#2D1212] p-4 rounded-lg border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 transition-all duration-200">
          <h3 className="text-[#1F2937] dark:text-[#FEF2F2] font-semibold mb-3">Status Distribution</h3>
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

        <div className="bg-white dark:bg-[#2D1212] p-4 rounded-lg border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 transition-all duration-200">
          <h3 className="text-[#1F2937] dark:text-[#FEF2F2] font-semibold mb-3">Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#7F1D1D20" />
              <XAxis dataKey="name" stroke={axisStroke} />
              <YAxis stroke={axisStroke} allowDecimals={false} />
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