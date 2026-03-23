import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper for error catching
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message || 'An unknown network error occurred');
  }
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return handleRequest(api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));
};

export const analyzeResume = async (resumeId, role, customJd = null) => {
  return handleRequest(api.post('/analyze', {
    resume_id: resumeId,
    role: role,
    custom_jd: customJd
  }));
};

export const getResults = async (analysisId) => {
  return handleRequest(api.get(`/results/${analysisId}`));
};

export const getHistory = async (limit = 10, offset = 0) => {
  return handleRequest(api.get(`/history?limit=${limit}&offset=${offset}`));
};

export const extractText = async (fileId) => {
  return handleRequest(api.get(`/extract-text/${fileId}`));
};

export default api;
