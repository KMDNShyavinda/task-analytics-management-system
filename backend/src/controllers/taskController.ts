import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      userId: req.userId,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};