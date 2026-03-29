// Cogniguard_frontend/src/api-config.ts

// Koi import.meta.env nahi, koi window.location nahi
// Direct backend URL ko string mein daal do
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
};