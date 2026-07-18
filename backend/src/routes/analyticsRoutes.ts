import express from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.get('/summary', protect, getAnalyticsSummary);

export default router;