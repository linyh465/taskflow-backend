import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import auth from './routes/auth';
import taskApi from './routes/tasks';

const app = new Hono();

app.use('*', cors({
  origin: process.env.FRONTEND_URL || '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => c.json({ message: 'TaskFlow API running 🚀' }));
app.route('/api/auth', auth);
app.route('/api/tasks', taskApi);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

// Railway provides PORT dynamically - must use it!
const port = Number(process.env.PORT ?? 3000);
console.log(`🚀 TaskFlow API starting on port ${port}`);

serve({ fetch: app.fetch, port });
