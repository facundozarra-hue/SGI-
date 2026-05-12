import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// ==================== ASPECTOS AMBIENTALES ====================

router.get('/aspectos', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const aspectos = await prisma.aspectoAmbiental.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ aspectos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener aspectos ambientales' });
  }
});

router.get('/aspectos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const aspecto = await prisma.aspectoAmbiental.findUnique({
      where: { id: req.params.id },
    });

    if (!aspecto) {
      res.status(404).json({ error: 'Aspecto ambiental no encontrado' });
      return;
    }

    res.json({ aspecto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener aspecto ambiental' });
  }
});

router.post('/aspectos', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { codigo, actividad, aspecto, impacto, significativo, medidas, indicador, meta } = req.body;

    if (!codigo || !actividad || !aspecto || !impacto) {
      res.status(400).json({ error: 'Código, actividad, aspecto e impacto son requeridos' });
      return;
    }

    const nuevoAspecto = await prisma.aspectoAmbiental.create({
      data: {
        codigo,
        actividad,
        aspecto,
        impacto,
        significativo: significativo || false,
        medidas,
        indicador,
        meta,
        estado: 'ACTIVO',
      },
    });

    res.status(201).json({ aspecto: nuevoAspecto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear aspecto ambiental' });
  }
});

router.put('/aspectos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const aspecto = await prisma.aspectoAmbiental.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ aspecto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar aspecto ambiental' });
  }
});

router.delete('/aspectos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.aspectoAmbiental.delete({ where: { id: req.params.id } });
    res.json({ message: 'Aspecto ambiental eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar aspecto ambiental' });
  }
});

// ==================== RESIDUOS ====================

router.get('/residuos', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const residuos = await prisma.residuo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ residuos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener residuos' });
  }
});

router.post('/residuos', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { codigo, nombre, tipo, cantidad, unidad, gestor, destino, certificado, fecha, observaciones } = req.body;

    if (!codigo || !nombre || !tipo || !cantidad || !unidad) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
      return;
    }

    const residuo = await prisma.residuo.create({
      data: {
        codigo,
        nombre,
        tipo,
        cantidad: parseFloat(cantidad),
        unidad,
        gestor,
        destino,
        certificado,
        fecha: fecha ? new Date(fecha) : new Date(),
        observaciones,
      },
    });

    res.status(201).json({ residuo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear residuo' });
  }
});

router.put('/residuos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const residuo = await prisma.residuo.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ residuo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar residuo' });
  }
});

router.delete('/residuos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.residuo.delete({ where: { id: req.params.id } });
    res.json({ message: 'Residuo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar residuo' });
  }
});

// ==================== CONSUMOS ====================

router.get('/consumos', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const consumos = await prisma.consumo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ consumos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener consumos' });
  }
});

router.post('/consumos', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tipo, cantidad, unidad, periodo, fecha, area } = req.body;

    if (!tipo || !cantidad || !unidad || !periodo) {
      res.status(400).json({ error: 'Tipo, cantidad, unidad y periodo son requeridos' });
      return;
    }

    const consumo = await prisma.consumo.create({
      data: {
        tipo,
        cantidad: parseFloat(cantidad),
        unidad,
        periodo,
        fecha: fecha ? new Date(fecha) : new Date(),
        area,
      },
    });

    res.status(201).json({ consumo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear consumo' });
  }
});

// Stats
router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [aspectos, residuos, consumos] = await Promise.all([
      prisma.aspectoAmbiental.count(),
      prisma.residuo.count(),
      prisma.consumo.count(),
    ]);

    const aspectosSignificativos = await prisma.aspectoAmbiental.count({
      where: { significativo: true },
    });

    const residuosPorTipo = await prisma.residuo.groupBy({
      by: ['tipo'],
      _count: true,
      _sum: { cantidad: true },
    });

    res.json({ aspectos, residuos, consumos, aspectosSignificativos, residuosPorTipo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
