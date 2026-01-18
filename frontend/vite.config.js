import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // load all env vars prefixed with VITE_ or custom ones (no prefix)
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],

        // only apply the proxy in dev
        server: mode === 'development'
            ? {
                proxy: {
                    '/api': {
                        // load from VITE_API_URL or fallback to the Docker service name
                        target: env.VITE_API_URL || 'http://backend:4000',
                        changeOrigin: true,
                        secure: false,
                        ws: true
                    }
                }
            }
            : undefined
    };
});
