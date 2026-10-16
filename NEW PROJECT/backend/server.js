import app from './src/app.js';
import { config } from './src/config/config.js';

const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 NEFRA Backend Service is running`);
  console.log(`📡 URL: http://127.0.0.1:${PORT}`);
  console.log(`🩺 Health: http://127.0.0.1:${PORT}/api/health`);
  console.log(`🔒 Escrow Fee Take-Rate: ${config.platformFeePercentage}%`);
  console.log(`===============================================`);
});
