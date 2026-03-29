// Cogniguard_frontend/src/api-config.ts

// @ts-ignore
const env = import.meta.env;

export const API_BASE_URL = (env && env.VITE_API_BASE_URL) || 
  (window.location.hostname === "localhost" 
    ? 'http://localhost:5000' 
    : 'https://major-project-8tc8.onrender.com');

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