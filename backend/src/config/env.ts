import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  APP_URL: process.env.APP_URL || '',
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || '',
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET || '',

  // Auth
  TOKEN_SECRET: process.env.TOKEN_SECRET || '',
  TOKEN_EXPIRY_HOURS: parseInt(process.env.TOKEN_EXPIRY_HOURS || '24', 10),

  // Persistence
  DATA_DIR: process.env.DATA_DIR || '.data',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',

  get isDev(): boolean {
    return this.NODE_ENV !== 'production';
  },
  get isProd(): boolean {
    return this.NODE_ENV === 'production';
  },
  get hasGemini(): boolean {
    return !!this.GEMINI_API_KEY;
  },
  get hasLinkedIn(): boolean {
    return !!this.LINKEDIN_CLIENT_ID && !!this.LINKEDIN_CLIENT_SECRET;
  },
  get hasTokenSecret(): boolean {
    return this.TOKEN_SECRET.length >= 32;
  },
};
