import { createApp } from './app.js';
import { handleOAuthCallback } from './controllers/linkedinController.js';
import { handleHealth } from './controllers/healthController.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { ensureBootstrapAdmin } from './services/authService.js';

export async function startServer() {
  await ensureBootstrapAdmin();
  const app = createApp();
  app.get(['/auth/callback', '/auth/callback/'], handleOAuthCallback);
  app.get('/healthz', handleHealth);
  app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`ResumeRadar API running on http://0.0.0.0:${env.PORT}`);
  });
}
