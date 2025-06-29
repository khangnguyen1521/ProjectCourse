const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Export additional API endpoints if needed
const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  COURSES: `${API_BASE_URL}/courses`,
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL;
export { API_ENDPOINTS }; 