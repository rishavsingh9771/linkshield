const formatTime = () => new Date().toISOString();

export const logger = {
  info: (msg, meta = '') => {
    console.log(`[${formatTime()}] [INFO] [LINKSHIELD] ${msg}`, meta ? meta : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`[${formatTime()}] [WARN] [LINKSHIELD] ${msg}`, meta ? meta : '');
  },
  error: (msg, error = '') => {
    console.error(`[${formatTime()}] [ERROR] [LINKSHIELD] ${msg}`, error ? (error.message || error) : '');
  },
  debug: (msg, meta = '') => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${formatTime()}] [DEBUG] [LINKSHIELD] ${msg}`, meta ? meta : '');
    }
  }
};
