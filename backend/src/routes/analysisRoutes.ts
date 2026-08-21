import { Router } from 'express';
import { handleAnalyze } from '../controllers/analysisController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/analyze', optionalAuth, handleAnalyze);

export { router as analysisRoutes };
