import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// ==================== RIESGOS ====================

router.get('/riesgos', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const riesgos = await prisma.riesgo.findMany({
      include: { responsable: { select: { nombre: true, apellido: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ riesgos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener riesgos' });
  }
});

router.get('/riesgos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const riesgo = await prisma.riesgo.findUnique({
      where: { id: req.params.id },
      include: { responsable: { select: { nombre: true, apellido: true, email: true } } },
    });
    if (!riesgo) {
      res.status(404).json({ error: 'Riesgo no encontrado' });
      return;
    }
    res.json({ riesgo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener riesgo' });
  }
});

router.post('/riesgos', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { codigo, actividad, peligro, riesgo, nivel, probabilidad, consecuencia, medidas, epi } = req.body;

    if (!codigo || !actividad || !peligro || !riesgo) {
      res.status(400).json({ error: 'Código, actividad, peligro y riesgo son requeridos' });
      return;
    }

    const nuevoRiesgo = await prisma.riesgo.create({
      data: {
        codigo,
        actividad,
        peligro,
        riesgo,
        nivel: nivel || 'MEDIO',
        estado: 'IDENTIFICADO',
        probabilidad: probabilidad ? parseInt(probabilidad) : 1,
        consecuencia: consecuencia ? parseInt(consecuencia) : 1,
        medidas,
        epi,
        responsableId: req.user!.id,
      },
    });

    res.status(201).json({ riesgo: nuevoRiesgo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear riesgo' });
  }
});

router.put('/riesgos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const riesgo = await prisma.riesgo.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ riesgo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar riesgo' });
  }
});

router.delete('/riesgos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.riesgo.delete({ where: { id: req.params.id } });
    res.json({ message: 'Riesgo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar riesgo' });
  }
});

// ==================== ACCIDENTES ====================

router.get('/accidentes', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const accidentes = await prisma.accidente.findMany({
      include: { responsable: { select: { nombre: true, apellido: true } } },
      orderBy: { fecha: 'desc' },
    });
    res.json({ accidentes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener accidentes' });
  }
});

router.get('/accidentes/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const accidente = await prisma.accidente.findUnique({
      where: { id: req.params.id },
      include: { responsable: { select: { nombre: true, apellido: true, email: true } } },
    });
    if (!accidente) {
      res.status(404).json({ error: 'Accidente no encontrado' });
      return;
    }
    res.json({ accidente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener accidente' });
  }
});

router.post('/accidentes', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { codigo, tipo, descripcion, lugar, fecha, lesionados, diasBaja, gravedad, causas, accionesCorrectivas } = req.body;

    if (!codigo || !tipo || !descripcion || !lugar || !fecha) {
      res.status(400).json({ error: 'Código, tipo, descripción, lugar y fecha son requeridos' });
      return;
    }

    const accidente = await prisma.accidente.create({
      data: {
        codigo,
        tipo,
        descripcion,
        lugar,
        fecha: new Date(fecha),
        lesionados: lesionados ? parseInt(lesionados) : 0,
        diasBaja: diasBaja ? parseInt(diasBaja) : 0,
        gravedad: gravedad || 'LEVE',
        causas,
        accionesCorrectivas,
        investigado: false,
        responsableId: req.user!.id,
      },
    });

    res.status(201).json({ accidente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear accidente' });
  }
});

router.put('/accidentes/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const accidente = await prisma.accidente.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ accidente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar accidente' });
  }
});

router.delete('/accidentes/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.accidente.delete({ where: { id: req.params.id } });
    res.json({ message: 'Accidente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar accidente' });
  }
});

// Stats
router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [riesgos, accidentes] = await Promise.all([
      prisma.riesgo.count(),
      prisma.accidente.count(),
    ]);

    const riesgosPorNivel = await prisma.riesgo.groupBy({
      by: ['nivel'],
      _count: true,
    });

    const accidentesPorGravedad = await prisma.accidente.groupBy({
      by: ['gravedad'],
      _count: true,
    });

    const totalLesionados = await prisma.accidente.aggregate({
      _sum: { lesionados: true, diasBaja: true },
    });

    res.json({ riesgos, accidentes, riesgosPorNivel, accidentesPorGravedad, totalLesionados: totalLesionados._sum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
