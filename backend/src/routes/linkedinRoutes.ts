import { Router } from 'express';
import {
  handleGetLinkedInAuthUrl,
  handleGetProfile,
  handleMatchJobs,
} from '../controllers/linkedinController.js';

const router = Router();

// LinkedIn OAuth URL (mounted at /api/auth/linkedin/url via parent router)
router.get('/auth/linkedin/url', handleGetLinkedInAuthUrl);

// LinkedIn data endpoints
router.get('/linkedin/profile', handleGetProfile);
router.post('/linkedin/match-jobs', handleMatchJobs);

export { router as linkedinRoutes };
