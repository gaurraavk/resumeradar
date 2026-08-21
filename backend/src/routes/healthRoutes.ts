import { Router } from 'express';
import { handleHealth } from '../controllers/healthController.js';

const router = Router();

router.get('/health', handleHealth);

export { router as healthRoutes };
