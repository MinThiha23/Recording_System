import React, { useState, useEffect } from 'react';
import { mockLogin, mockRegister, mockGetCurrentUser, mockGetPrograms, mockGetUsers } from './utils/mockAuth';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ApplyProgram from './components/ApplyProgram';
import AdminDashboard from './components/AdminDashboard';
import FinanceDashboard from './components/FinanceDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchPrograms();
      if (currentUser.role === 'admin' || currentUser.role === 'finance') {
        fetchUsers();
      }
    }
  }, [isLoggedIn, currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = await mockGetCurrentUser(token);
      setCurrentUser(userData);
      setIsLoggedIn(true);
      // Set default page based on role
      if (userData.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (userData.role === 'finance') {
        setCurrentPage('finance-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      // If token is invalid, clear it
      localStorage.removeItem('token');
    }
  };

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await mockGetPrograms(token);
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await mockGetUsers(token);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const data = await mockLogin(credentials.email, credentials.password);
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      setIsLoggedIn(true);
      
      // Set page based on role
      if (data.user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (data.user.role === 'finance') {
        setCurrentPage('finance-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'An error occurred during login. Please try again.');
    }
  };

  const handleRegister = async (userData) => {
    try {
      await mockRegister(userData);
      alert('Registration successful! Please login.');
      setCurrentPage('login');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'An error occurred during registration. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('login');
    setPrograms([]);
    setUsers([]);
  };

  const getNavigationItems = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'admin':
        return [
          { name: 'Dashboard', page: 'admin-dashboard' },
          { name: 'Users', page: 'users' },
          { name: 'Programs', page: 'programs' }
        ];
      case 'finance':
        return [
          { name: 'Dashboard', page: 'finance-dashboard' },
          { name: 'Programs', page: 'programs' }
        ];
      default:
        return [
          { name: 'Dashboard', page: 'dashboard' },
          { name: 'Apply Program', page: 'apply-program' }
        ];
    }
  };

  const renderPage = () => {
    if (!currentUser) return null;

    switch (currentPage) {
      case 'admin-dashboard':
        return currentUser.role === 'admin' ? 
          <AdminDashboard programs={programs} users={users} setCurrentPage={setCurrentPage} /> : null;
      case 'finance-dashboard':
        return currentUser.role === 'finance' ? 
          <FinanceDashboard programs={programs} setPrograms={setPrograms} /> : null;
      case 'dashboard':
        return <Dashboard programs={programs} currentUser={currentUser} setCurrentPage={setCurrentPage} />;
      case 'apply-program':
        return <ApplyProgram currentUser={currentUser} onProgramAdded={fetchPrograms} />;
      default:
        if (currentUser.role === 'admin') {
          return <AdminDashboard programs={programs} users={users} setCurrentPage={setCurrentPage} />;
        } else if (currentUser.role === 'finance') {
          return <FinanceDashboard programs={programs} setPrograms={setPrograms} />;
        } else {
          return <Dashboard programs={programs} currentUser={currentUser} setCurrentPage={setCurrentPage} />;
        }
    }
  };

  if (!isLoggedIn) {
    if (currentPage === 'register') {
      return <Register onRegister={handleRegister} onBackToLogin={() => setCurrentPage('login')} />;
    }
    return <Login onLogin={handleLogin} onShowRegister={() => setCurrentPage('register')} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">Program Management System</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {getNavigationItems().map((item) => (
                    <button
                      key={item.page}
                      onClick={() => setCurrentPage(item.page)}
                      className={`${
                        currentPage === item.page
                          ? 'bg-blue-900 text-white'
                          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <span className="font-medium">{currentUser?.name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-600 rounded-full text-xs">
                  {currentUser?.role?.toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;