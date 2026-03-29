// src/api-config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  LOGIN: ${API_BASE_URL}/auth/login,
  REGISTER: ${API_BASE_URL}/auth/register,
  FILES: ${API_BASE_URL}/api/files,
  UPLOAD: ${API_BASE_URL}/api/upload,
  ML_STATS: ${API_BASE_URL}/api/ml-stats,
  PROFILE: ${API_BASE_URL}/api/profile,
};