import express from 'express';
import { createTask } from '../controllers/taskController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createTask);

export default router;