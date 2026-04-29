import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const auth = new Hono();
const prisma = new PrismaClient();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// POST /api/auth/register
auth.post('/register', zValidator('json', authSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return c.json({ message: 'User created', userId: user.id }, 201);
  } catch {
    return c.json({ error: 'User already exists' }, 400);
  }
});

// POST /api/auth/login
auth.post('/login', zValidator('json', authSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const token = await sign(
    { id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
    secret,
    'HS256'
  );
  return c.json({ token, user: { id: user.id, email: user.email } });
});

// GET /api/auth/me
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  return c.json({ message: 'ok' });
});

export default auth;
