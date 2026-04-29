import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { PrismaClient } from '@prisma/client';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const taskApi = new Hono();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Apply JWT middleware to all task routes
taskApi.use('*', jwt({ secret: JWT_SECRET }));

const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional(),
});

// GET /api/tasks
taskApi.get('/', async (c) => {
  const user = c.get('jwtPayload');
  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return c.json(tasks);
});

// POST /api/tasks
taskApi.post('/', zValidator('json', taskSchema), async (c) => {
  const user = c.get('jwtPayload');
  const body = c.req.valid('json');
  const task = await prisma.task.create({
    data: { ...body, userId: user.id },
  });
  return c.json(task, 201);
});

// PATCH /api/tasks/:id
taskApi.patch('/:id', zValidator('json', taskSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const user = c.get('jwtPayload');
  const body = c.req.valid('json');
  try {
    const task = await prisma.task.update({
      where: { id, userId: user.id },
      data: body,
    });
    return c.json(task);
  } catch {
    return c.json({ error: 'Task not found' }, 404);
  }
});

// DELETE /api/tasks/:id
taskApi.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const user = c.get('jwtPayload');
  try {
    await prisma.task.delete({ where: { id, userId: user.id } });
    return c.json({ message: 'Task deleted' });
  } catch {
    return c.json({ error: 'Task not found' }, 404);
  }
});

export default taskApi;
