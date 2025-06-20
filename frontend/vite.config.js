import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';

// Only use HTTPS config in local development
export default defineConfig({
  server:
    process.env.VITE_ENV === 'PROD' || process.env.NODE_ENV === 'production'
      ? {}
      : {
          https: {
            key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
          },
          host: 'localhost', // Optional
          port: 5173, // Optional
        },
  plugins: [react()],
});
