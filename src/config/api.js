const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  CURRENT_USER: `${API_BASE_URL}/api/users/current`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
  CREATE_USER: `${API_BASE_URL}/api/users`,
  UPDATE_USER: (id) => `${API_BASE_URL}/api/users/${id}`,
  DELETE_USER: (id) => `${API_BASE_URL}/api/users/${id}`,
  
  // Programs
  PROGRAMS: `${API_BASE_URL}/api/programs`,
  CREATE_PROGRAM: `${API_BASE_URL}/api/programs`,
  UPDATE_PROGRAM: (id) => `${API_BASE_URL}/api/programs/${id}`,
  DELETE_PROGRAM: (id) => `${API_BASE_URL}/api/programs/${id}`,
  UPLOAD_PROGRAM_DOCUMENTS: (id) => `${API_BASE_URL}/api/programs/${id}/upload-documents`,
  UPDATE_PROGRAM_STATUS: (id) => `${API_BASE_URL}/api/programs/${id}/update-status`,
  FINAL_APPROVE_PROGRAM: (id) => `${API_BASE_URL}/api/programs/${id}/final-approve`,
  
  // Queries
  QUERIES: `${API_BASE_URL}/api/queries`,
  CREATE_QUERY: `${API_BASE_URL}/api/queries`,
  ANSWER_QUERY: (id) => `${API_BASE_URL}/api/queries/${id}/answer`,
  RESOLVE_QUERY: (id) => `${API_BASE_URL}/api/queries/${id}/resolve`,
  
  // Payments
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  
  // File uploads
  UPLOADS: `${API_BASE_URL}/uploads`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

// Helper function to make API calls with authentication
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(endpoint, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Helper function for file uploads
export const uploadFile = async (endpoint, formData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
  }

  return response.json();
}; 