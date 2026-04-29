import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { PrismaClient } from '@prisma/client';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

type Variables = { userId: string };

const taskApi = new Hono<{ Variables: Variables }>();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

taskApi.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.slice(7);
  try {
    const payload = await verify(token, JWT_SECRET);
    c.set('userId', payload['id'] as string);
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional(),
});

taskApi.get('/', async (c) => {
  const userId = c.get('userId');
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return c.json(tasks);
});

taskApi.post('/', zValidator('json', taskSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');
  const task = await prisma.task.create({ data: { ...body, userId } });
  return c.json(task, 201);
});

taskApi.patch('/:id', zValidator('json', taskSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  const body = c.req.valid('json');
  try {
    const task = await prisma.task.update({ where: { id, userId }, data: body });
    return c.json(task);
  } catch {
    return c.json({ error: 'Task not found' }, 404);
  }
});

taskApi.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  try {
    await prisma.task.delete({ where: { id, userId } });
    return c.json({ message: 'Task deleted' });
  } catch {
    return c.json({ error: 'Task not found' }, 404);
  }
});

export default taskApi;
