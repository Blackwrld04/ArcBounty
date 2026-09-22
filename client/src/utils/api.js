/**
 * Centralized API Base URL for ArcBounty Client
 * Reads VITE_API_URL in production or defaults to http://localhost:4050 in local development.
 */
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4050';
