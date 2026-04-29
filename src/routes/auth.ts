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
  const token = await sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!
  );
  return c.json({ token, user: { id: user.id, email: user.email } });
});

// GET /api/auth/me
auth.get('/me', async (c) => {
  const payload = c.get('jwtPayload');
  const user = await prisma.user.findUnique({
    where: { id: payload?.id },
    select: { id: true, email: true, createdAt: true },
  });
  if (!user) return c.json({ error: 'User not found' }, 404);
  return c.json(user);
});

export default auth;
