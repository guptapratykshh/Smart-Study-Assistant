/**
 * API Configuration
 * 
 * This file manages the backend API URL for the frontend.
 * 
 * DEFAULT: Always uses deployed backend URL
 * 
 * To use localhost for testing (optional):
 *   - Create .env.local file with: NEXT_PUBLIC_USE_LOCALHOST=true
 *   - Or: NEXT_PUBLIC_API_URL=http://localhost:4000
 */

// Deployed backend URL (DEFAULT - always used unless overridden)
const DEPLOYED_BACKEND_URL = 'https://smart-study-assistant-1.onrender.com'

// Local backend URL (only used if explicitly enabled)
const LOCAL_BACKEND_URL = 'http://localhost:4000'

/**
 * Get the API URL based on environment configuration
 * @returns {string} The backend API URL
 */
export function getApiUrl() {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default to deployed
    return process.env.NEXT_PUBLIC_API_URL || DEPLOYED_BACKEND_URL
  }

  // Client-side: check for USE_LOCALHOST flag first
  const useLocalhost = process.env.NEXT_PUBLIC_USE_LOCALHOST === 'true'
  
  if (useLocalhost) {
    console.log('🔧 Using LOCALHOST backend:', LOCAL_BACKEND_URL)
    return LOCAL_BACKEND_URL
  }

  // Check for explicit API URL
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (envApiUrl) {
    // If explicitly set, use it (even if localhost)
    console.log('🔗 Using configured API URL:', envApiUrl)
    return envApiUrl
  }

  // Default to deployed backend
  console.log('🌐 Using DEPLOYED backend:', DEPLOYED_BACKEND_URL)
  return DEPLOYED_BACKEND_URL
}

// Export URLs for reference
export { DEPLOYED_BACKEND_URL, LOCAL_BACKEND_URL }

// Note: Don't call getApiUrl() at module level
// Always call it inside components/functions to get the correct URL

