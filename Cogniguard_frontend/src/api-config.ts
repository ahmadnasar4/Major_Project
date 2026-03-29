// src/api-config.ts

export const API_BASE_URL = 'https://major-project-8tc8.onrender.com';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  FILES: `${API_BASE_URL}/api/files`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  ML_STATS: `${API_BASE_URL}/api/ml-stats`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  LOGS: `${API_BASE_URL}/api/logs`,
  VAULT_KEYS: `${API_BASE_URL}/api/vault/keys`,
  
  // --- YE WALE MISSING THAY ---
  DOWNLOAD: (id: number) => `${API_BASE_URL}/api/download/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/api/delete/${id}`,
  METRICS_UPLOAD: `${API_BASE_URL}/api/metrics/upload`,
  METRICS_DOWNLOAD: `${API_BASE_URL}/api/metrics/download`,
};