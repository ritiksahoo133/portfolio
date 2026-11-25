import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Local development shim for the Vercel function in api/contact.ts.
 * `vite` does not run api/ routes, so this loads the same handler on POST /api/contact.
 * Reads GMAIL_APP_PASSWORD (and optional GMAIL_USER) from .env.local, which is git-ignored.
 */
function contactApiDevPlugin(): Plugin {
  return {
    name: 'contact-api-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      for (const key of ['GMAIL_APP_PASSWORD', 'GMAIL_USER']) {
        if (env[key] && !process.env[key]) process.env[key] = env[key];
      }

      server.middlewares.use('/api/contact', async (req, res) => {
        let raw = '';
        for await (const chunk of req) raw += chunk;

        const handlerReq = { method: req.method, body: raw };
        const handlerRes = {
          setHeader: (name: string, value: string) => res.setHeader(name, value),
          status(code: number) {
            res.statusCode = code;
            return this;
          },
          json(payload: unknown) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
            return this;
          },
        };

        try {
          const mod = await server.ssrLoadModule('/api/contact.ts');
          await mod.default(handlerReq, handlerRes);
        } catch (error) {
          console.error('[contact-api-dev]', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Local contact API failed to load.' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contactApiDevPlugin()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
