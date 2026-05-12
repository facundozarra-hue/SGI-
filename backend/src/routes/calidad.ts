import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Apply auth middleware to all routes
router.use(authenticateToken);

// ==================== DOCUMENTOS ====================

router.get('/documentos', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { estado, modulo, search } = req.query;
    const where: Record<string, unknown> = {};

    if (estado) where.estado = estado;
    if (modulo) where.modulo = modulo;
    if (search) {
      where.OR = [
        { titulo: { contains: search as string, mode: 'insensitive' } },
        { codigo: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const documentos = await prisma.documento.findMany({
      where,
      include: { creadoPor: { select: { nombre: true, apellido: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ documentos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
});

router.get('/documentos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const documento = await prisma.documento.findUnique({
      where: { id: req.params.id },
      include: { creadoPor: { select: { nombre: true, apellido: true, email: true } } },
    });

    if (!documento) {
      res.status(404).json({ error: 'Documento no encontrado' });
      return;
    }

    res.json({ documento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener documento' });
  }
});

router.post('/documentos', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { codigo, titulo, descripcion, version, estado, modulo, categoria, fechaRevision } = req.body;

    if (!codigo || !titulo || !modulo || !categoria) {
      res.status(400).json({ error: 'Código, título, módulo y categoría son requeridos' });
      return;
    }

    const documento = await prisma.documento.create({
      data: {
        codigo,
        titulo,
        descripcion,
        version: version || '1.0',
        estado: estado || 'BORRADOR',
        modulo,
        categoria,
        fechaRevision: fechaRevision ? new Date(fechaRevision) : undefined,
        creadoPorId: req.user!.id,
      },
    });

    res.status(201).json({ documento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear documento' });
  }
});

router.put('/documentos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const documento = await prisma.documento.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ documento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar documento' });
  }
});

router.delete('/documentos/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.documento.delete({ where: { id: req.params.id } });
    res.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
});

// ==================== NO CONFORMIDADES ====================

router.get('/no-conformidades', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { estado, search } = req.query;
    const where: Record<string, unknown> = {};

    if (estado) where.estado = estado;
    if (search) {
      where.OR = [
        { titulo: { contains: search as string, mode: 'insensitive' } },
        { codigo: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const noConformidades = await prisma.noConformidad.findMany({
      where,
      include: { responsable: { select: { nombre: true, apellido: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ noConformidades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener no conformidades' });
  }
});

router.get('/no-conformidades/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nc = await prisma.noConformidad.findUnique({
      where: { id: req.params.id },
      include: { responsable: { select: { nombre: true, apellido: true, email: true } } },
    });

    if (!nc) {
      res.status(404).json({ error: 'No conformidad no encontrada' });
      return;
    }

    res.json({ noConformidad: nc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener no conformidad' });
  }
});

router.post('/no-conformidades', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { codigo, titulo, descripcion, origen, estado, prioridad, accionCorrectiva, fechaDeteccion } = req.body;

    if (!codigo || !titulo || !descripcion || !origen) {
      res.status(400).json({ error: 'Código, título, descripción y origen son requeridos' });
      return;
    }

    const nc = await prisma.noConformidad.create({
      data: {
        codigo,
        titulo,
        descripcion,
        origen,
        estado: estado || 'ABIERTA',
        prioridad: prioridad || 'MEDIA',
        accionCorrectiva,
        fechaDeteccion: fechaDeteccion ? new Date(fechaDeteccion) : new Date(),
        responsableId: req.user!.id,
      },
    });

    res.status(201).json({ noConformidad: nc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear no conformidad' });
  }
});

router.put('/no-conformidades/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const nc = await prisma.noConformidad.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ noConformidad: nc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar no conformidad' });
  }
});

router.delete('/no-conformidades/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.noConformidad.delete({ where: { id: req.params.id } });
    res.json({ message: 'No conformidad eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar no conformidad' });
  }
});

// ==================== AUDITORÍAS ====================

router.get('/auditorias', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { estado, tipo, search } = req.query;
    const where: Record<string, unknown> = {};

    if (estado) where.estado = estado;
    if (tipo) where.tipo = tipo;
    if (search) {
      where.OR = [
        { titulo: { contains: search as string, mode: 'insensitive' } },
        { codigo: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const auditorias = await prisma.auditoria.findMany({
      where,
      include: { responsable: { select: { nombre: true, apellido: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ auditorias });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener auditorías' });
  }
});

router.post('/auditorias', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { codigo, titulo, tipo, estado, modulo, alcance, fechaInicio, fechaFin, auditor, hallazgos, conclusiones } = req.body;

    if (!codigo || !titulo || !modulo || !fechaInicio || !fechaFin || !auditor) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
      return;
    }

    const auditoria = await prisma.auditoria.create({
      data: {
        codigo,
        titulo,
        tipo: tipo || 'INTERNA',
        estado: estado || 'PLANIFICADA',
        modulo,
        alcance,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        auditor,
        hallazgos,
        conclusiones,
        responsableId: req.user!.id,
      },
    });

    res.status(201).json({ auditoria });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear auditoría' });
  }
});

router.put('/auditorias/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const auditoria = await prisma.auditoria.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ auditoria });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar auditoría' });
  }
});

router.delete('/auditorias/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.auditoria.delete({ where: { id: req.params.id } });
    res.json({ message: 'Auditoría eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar auditoría' });
  }
});

// Stats endpoint
router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [documentos, noConformidades, auditorias] = await Promise.all([
      prisma.documento.count(),
      prisma.noConformidad.count(),
      prisma.auditoria.count(),
    ]);

    const documentosPorEstado = await prisma.documento.groupBy({
      by: ['estado'],
      _count: true,
    });

    const ncPorEstado = await prisma.noConformidad.groupBy({
      by: ['estado'],
      _count: true,
    });

    res.json({ documentos, noConformidades, auditorias, documentosPorEstado, ncPorEstado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
