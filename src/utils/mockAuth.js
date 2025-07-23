// Mock authentication system for testing
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'user@test.com',
    password: 'user123',
    role: 'user'
  },
  {
    id: 3,
    name: 'Finance Manager',
    email: 'finance@test.com',
    password: 'finance123',
    role: 'finance'
  }
];

const mockPrograms = [
  {
    id: 1,
    name: 'Community Development Program',
    budget: 50000,
    recipientName: 'Community Center',
    status: 'approved',
    created_by: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 2,
    name: 'Youth Education Initiative',
    budget: 25000,
    recipientName: 'Local School',
    status: 'pending',
    created_by: 2,
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-18T09:15:00Z'
  },
  {
    id: 3,
    name: 'Healthcare Support Program',
    budget: 75000,
    recipientName: 'Medical Clinic',
    status: 'under_review',
    created_by: 2,
    created_at: '2024-01-20T11:45:00Z',
    updated_at: '2024-01-22T16:20:00Z'
  }
];

export const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword,
      token: `mock-token-${user.id}`
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

export const mockRegister = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'user'
  };
  
  mockUsers.push(newUser);
  
  return {
    success: true,
    message: 'Registration successful'
  };
};

export const mockGetCurrentUser = async (token) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!token || !token.startsWith('mock-token-')) {
    throw new Error('Invalid token');
  }
  
  const userId = parseInt(token.replace('mock-token-', ''));
  const user = mockUsers.find(u => u.id === userId);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } else {
    throw new Error('User not found');
  }
};

export const mockGetPrograms = async (token) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!token || !token.startsWith('mock-token-')) {
    throw new Error('Invalid token');
  }
  
  const userId = parseInt(token.replace('mock-token-', ''));
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Return all programs for admin/finance, only user's programs for regular users
  if (user.role === 'admin' || user.role === 'finance') {
    return mockPrograms;
  } else {
    return mockPrograms.filter(p => p.created_by === userId);
  }
};

export const mockGetUsers = async (token) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!token || !token.startsWith('mock-token-')) {
    throw new Error('Invalid token');
  }
  
  const userId = parseInt(token.replace('mock-token-', ''));
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user || user.role !== 'admin') {
    throw new Error('Access denied');
  }
  
  // Return users without passwords
  return mockUsers.map(({ password: _, ...user }) => user);
};

export const mockCreateProgram = async (token, programData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!token || !token.startsWith('mock-token-')) {
    throw new Error('Invalid token');
  }
  
  const userId = parseInt(token.replace('mock-token-', ''));
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const newProgram = {
    id: mockPrograms.length + 1,
    name: programData.name,
    budget: parseFloat(programData.budget),
    recipientName: programData.recipientName,
    status: 'pending',
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockPrograms.push(newProgram);
  
  return newProgram;
};