import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son requeridos' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.activo) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/register (admin only in production)
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nombre, apellido, role } = req.body;

    if (!email || !password || !nombre || !apellido) {
      res.status(400).json({ error: 'Todos los campos son requeridos' });
      return;
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      res.status(409).json({ error: 'El email ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        nombre,
        apellido,
        role: role || 'USER',
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true,
        activo: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({ user });
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
});

export default router;
