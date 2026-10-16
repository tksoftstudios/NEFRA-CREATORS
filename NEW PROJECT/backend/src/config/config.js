import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT, 10) || 5001,
  corsOrigins: (process.env.CORS_ORIGIN || 'http://127.0.0.1:5175,http://localhost:5175,http://localhost:5173')
    .split(',')
    .map(origin => origin.trim()),
  platformFeePercentage: parseFloat(process.env.PLATFORM_FEE_PERCENTAGE) || 10,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
};
