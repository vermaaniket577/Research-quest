/**
 * API barrel file - re-exports all API functions
 * Pages import from '@/lib/api' which maps to this file
 */
export {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  getDashboard,
  getGoogleAuthUrl,
} from '../services/api/auth.api';