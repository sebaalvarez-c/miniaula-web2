import api from './api.js';

export const getMisInscripciones = () => api.get('/inscripciones').then((r) => r.data);
