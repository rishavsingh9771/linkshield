import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  virusTotalApiKey: process.env.VIRUSTOTAL_API_KEY ? process.env.VIRUSTOTAL_API_KEY.trim() : '',
  isApiKeyConfigured() {
    return Boolean(this.virusTotalApiKey && this.virusTotalApiKey !== 'YOUR_API_KEY');
  }
};
