import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sgi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('sgi_token');
      localStorage.removeItem('sgi_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

export const calidadService = {
  getDocumentos: () => api.get('/calidad/documentos'),
  createDocumento: (data: object) => api.post('/calidad/documentos', data),
  updateDocumento: (id: string, data: object) => api.put(`/calidad/documentos/${id}`, data),
  deleteDocumento: (id: string) => api.delete(`/calidad/documentos/${id}`),

  getNoConformidades: () => api.get('/calidad/no-conformidades'),
  createNoConformidad: (data: object) => api.post('/calidad/no-conformidades', data),
  updateNoConformidad: (id: string, data: object) => api.put(`/calidad/no-conformidades/${id}`, data),
  deleteNoConformidad: (id: string) => api.delete(`/calidad/no-conformidades/${id}`),

  getAuditorias: () => api.get('/calidad/auditorias'),
  createAuditoria: (data: object) => api.post('/calidad/auditorias', data),
  updateAuditoria: (id: string, data: object) => api.put(`/calidad/auditorias/${id}`, data),
  deleteAuditoria: (id: string) => api.delete(`/calidad/auditorias/${id}`),

  getStats: () => api.get('/calidad/stats'),
};

export const medioambienteService = {
  getAspectos: () => api.get('/medioambiente/aspectos'),
  createAspecto: (data: object) => api.post('/medioambiente/aspectos', data),
  updateAspecto: (id: string, data: object) => api.put(`/medioambiente/aspectos/${id}`, data),
  deleteAspecto: (id: string) => api.delete(`/medioambiente/aspectos/${id}`),

  getResiduos: () => api.get('/medioambiente/residuos'),
  createResiduo: (data: object) => api.post('/medioambiente/residuos', data),
  updateResiduo: (id: string, data: object) => api.put(`/medioambiente/residuos/${id}`, data),
  deleteResiduo: (id: string) => api.delete(`/medioambiente/residuos/${id}`),

  getStats: () => api.get('/medioambiente/stats'),
};

export const seguridadService = {
  getRiesgos: () => api.get('/seguridad/riesgos'),
  createRiesgo: (data: object) => api.post('/seguridad/riesgos', data),
  updateRiesgo: (id: string, data: object) => api.put(`/seguridad/riesgos/${id}`, data),
  deleteRiesgo: (id: string) => api.delete(`/seguridad/riesgos/${id}`),

  getAccidentes: () => api.get('/seguridad/accidentes'),
  createAccidente: (data: object) => api.post('/seguridad/accidentes', data),
  updateAccidente: (id: string, data: object) => api.put(`/seguridad/accidentes/${id}`, data),
  deleteAccidente: (id: string) => api.delete(`/seguridad/accidentes/${id}`),

  getStats: () => api.get('/seguridad/stats'),
};

export default api;
