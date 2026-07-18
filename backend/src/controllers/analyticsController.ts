import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAnalyticsSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const allTasks = await Task.find({ userId });

    const statusCounts = {
      'To Do': 0,
      'In Progress': 0,
      'Completed': 0,
    };

    const priorityCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    let completedToday = 0;
    let overdue = 0;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    allTasks.forEach((task) => {
      statusCounts[task.status] += 1;
      priorityCounts[task.priority] += 1;

      if (
        task.status === 'Completed' &&
        task.updatedAt >= startOfToday &&
        task.updatedAt < endOfToday
      ) {
        completedToday += 1;
      }

      if (task.status !== 'Completed' && task.dueDate < now) {
        overdue += 1;
      }
    });

    const totalActiveTasks = allTasks.filter((t) => t.status !== 'Completed').length;

    res.status(200).json({
      totalActiveTasks,
      completedToday,
      overdue,
      statusBreakdown: statusCounts,
      priorityBreakdown: priorityCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
};