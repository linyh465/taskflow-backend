import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import auth from './routes/auth';
import taskApi from './routes/tasks';

const app = new Hono();

app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => c.json({ message: 'TaskFlow API running 🚀' }));

// Public routes
app.route('/api/auth', auth);

// Protected routes - middleware applied in route handlers
app.route('/api/tasks', taskApi);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

const port = Number(process.env.PORT) || 3001;
serve({ fetch: app.fetch, port });
console.log('🚀 TaskFlow API running on port', port);
