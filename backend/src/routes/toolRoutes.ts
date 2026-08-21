import { Router } from 'express';
import { handleOptimize } from '../controllers/optimizationController.js';
import { handleCoverLetter, handleBulletRewrite } from '../controllers/toolController.js';
import { handleAtsCheck, handleInterviewQuestions } from '../controllers/advancedToolController.js';

const router = Router();

router.post('/optimize', handleOptimize);
router.post('/cover-letter', handleCoverLetter);
router.post('/rewrite-bullet', handleBulletRewrite);
router.post('/interview-questions', handleInterviewQuestions);
router.post('/ats-check', handleAtsCheck);

export { router as toolRoutes };
