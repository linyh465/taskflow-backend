import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
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

// Protected routes
app.use('/api/tasks/*', jwt({ secret: process.env.JWT_SECRET! }));
app.route('/api/tasks', taskApi);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3001 });
console.log('🚀 TaskFlow API running on port', process.env.PORT || 3001);
