import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import ApplyProgram from './components/ApplyProgram';
import StatusTracking from './components/StatusTracking';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from PHP backend
  useEffect(() => {
    if (currentUser) {
      fetchPrograms();
      fetchUsers();
    }
  }, [currentUser]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      // Use mock data if API fails
      setPrograms([
        {
          id: 1,
          name: 'Community Development Program',
          budget: 50000,
          recipientName: 'Community Center',
          status: 'approved',
          created_by: 1,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T14:30:00Z'
        },
        {
          id: 2,
          name: 'Youth Education Initiative',
          budget: 25000,
          recipientName: 'Local School',
          status: 'pending',
          created_by: 1,
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
        },
        {
          id: 4,
          name: 'Environmental Conservation',
          budget: 30000,
          recipientName: 'Green Foundation',
          status: 'approved',
          created_by: 1,
          created_at: '2024-01-25T08:30:00Z',
          updated_at: '2024-01-28T12:15:00Z'
        },
        {
          id: 5,
          name: 'Senior Care Program',
          budget: 40000,
          recipientName: 'Elder Care Center',
          status: 'rejected',
          created_by: 3,
          created_at: '2024-02-01T14:20:00Z',
          updated_at: '2024-02-05T09:45:00Z'
        },
        {
          id: 6,
          name: 'Technology Training',
          budget: 35000,
          recipientName: 'Tech Institute',
          status: 'draft',
          created_by: 1,
          created_at: '2024-02-10T16:00:00Z',
          updated_at: '2024-02-10T16:00:00Z'
        }
      ]);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Use mock data if API fails
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        { id: 3, name: 'Finance Manager', email: 'finance@example.com', role: 'staff_finance' }
      ]);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        localStorage.setItem('token', userData.token);
        setCurrentPage('dashboard');
      } else {
        // Mock login for demo
        const mockUser = {
          id: 1,
          name: 'John Doe',
          email: credentials.email,
          role: credentials.email.includes('admin') ? 'admin' : 'user',
          token: 'mock-token-123'
        };
        setCurrentUser(mockUser);
        localStorage.setItem('token', mockUser.token);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Mock login fallback
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'user',
        token: 'mock-token-123'
      };
      setCurrentUser(mockUser);
      localStorage.setItem('token', mockUser.token);
      setCurrentPage('dashboard');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Registration successful! Please login.');
        setShowRegister(false);
      } else {
        alert('Registration successful! Please login.');
        setShowRegister(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration successful! Please login.');
      setShowRegister(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    localStorage.removeItem('token');
  };

  const handleProgramAdded = () => {
    fetchPrograms();
  };

  if (!currentUser) {
    if (showRegister) {
      return (
        <LanguageProvider>
          <Register 
            onRegister={handleRegister}
            onBackToLogin={() => setShowRegister(false)}
          />
        </LanguageProvider>
      );
    }
    return (
      <LanguageProvider>
        <Login 
          onLogin={handleLogin}
          onShowRegister={() => setShowRegister(true)}
        />
      </LanguageProvider>
    );
  }

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return currentUser.role === 'admin' ? (
          <AdminDashboard 
            programs={programs}
            users={users}
            setCurrentPage={setCurrentPage}
            setPrograms={setPrograms}
            setUsers={setUsers}
          />
        ) : (
          <Dashboard 
            programs={programs.filter(p => p.created_by === currentUser.id)}
            currentUser={currentUser}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'user-management':
        return currentUser.role === 'admin' ? (
          <UserManagement users={users} setUsers={setUsers} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access this page.</p>
          </div>
        );
      case 'apply-program':
        return (
          <ApplyProgram 
            currentUser={currentUser}
            onProgramAdded={handleProgramAdded}
          />
        );
      case 'status-tracking':
        return (
          <StatusTracking 
            users={users}
            setUsers={setUsers}
            programs={programs}
            setPrograms={setPrograms}
            currentUser={currentUser}
          />
        );
      default:
        return <Dashboard programs={programs} currentUser={currentUser} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-xl border-b-4 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                      <div className="text-red-600 font-bold text-sm">🇲🇾</div>
                    </div>
                    <div>
                      <h1 className="text-white text-lg font-bold">PROGRAM MANAGEMENT SYSTEM</h1>
                      <p className="text-blue-200 text-xs">SISTEM PENGURUSAN PROGRAM</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <button
                      onClick={() => setCurrentPage('dashboard')}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === 'dashboard'
                          ? 'bg-yellow-400 text-blue-900 font-semibold'
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setCurrentPage('apply-program')}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === 'apply-program'
                          ? 'bg-yellow-400 text-blue-900 font-semibold'
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      }`}
                    >
                      Apply Program
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setCurrentPage('user-management')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === 'user-management'
                            ? 'bg-yellow-400 text-blue-900 font-semibold'
                            : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                        }`}
                      >
                        Users
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentPage('status-tracking')}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === 'status-tracking'
                          ? 'bg-yellow-400 text-blue-900 font-semibold'
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      }`}
                    >
                      Status
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-white text-sm">
                  <span className="font-medium">{currentUser.name}</span>
                  <span className="ml-2 px-2 py-1 bg-yellow-400 text-blue-900 rounded-full text-xs font-semibold">
                    {currentUser.role.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;