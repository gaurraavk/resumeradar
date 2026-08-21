import { Router } from 'express';
import { analysisRoutes } from './analysisRoutes.js';
import { toolRoutes } from './toolRoutes.js';
import { linkedinRoutes } from './linkedinRoutes.js';
import { healthRoutes } from './healthRoutes.js';
import { authRoutes } from './authRoutes.js';
import { libraryRoutes } from './libraryRoutes.js';
import { historyRoutes } from './historyRoutes.js';
import { adminRoutes } from './adminRoutes.js';

/**
 * Aggregate all API routes.
 * Mounted at /api (and /api/v1) in app.ts.
 */
const router = Router();

// Core AI endpoints
router.use('/', analysisRoutes);
router.use('/', toolRoutes);

// LinkedIn OAuth & data
router.use('/', linkedinRoutes);

// Health
router.use('/', healthRoutes);
router.use('/', authRoutes);
router.use('/', libraryRoutes);
router.use('/', historyRoutes);
router.use('/', adminRoutes);

export { router as apiRouter };
