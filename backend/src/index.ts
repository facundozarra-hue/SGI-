import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import calidadRoutes from './routes/calidad';
import medioambienteRoutes from './routes/medioambiente';
import seguridadRoutes from './routes/seguridad';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/calidad', calidadRoutes);
app.use('/api/medioambiente', medioambienteRoutes);
app.use('/api/seguridad', seguridadRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor SGI corriendo en http://localhost:${PORT}`);
});

export default app;
