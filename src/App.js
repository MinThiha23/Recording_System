import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import ProgramManagement from './components/ProgramManagement';
import StatusTracking from './components/StatusTracking';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { API_ENDPOINTS, apiCall } from './config/api';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { language, changeLanguage, t } = useLanguage();

  const navigationItems = currentUser?.role === 'admin' ? [
    { name: t('users'), page: 'user-management' },
    { name: t('programs'), page: 'program-management' },
    { name: t('status'), page: 'status-tracking' },
  ] : currentUser?.role === 'staff_finance' ? [
    { name: t('programs'), page: 'program-management' },
  ] : [
    { name: t('programs'), page: 'program-management' },
  ];

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('currentPage', currentPage);
      fetchCurrentUser();
      if (currentUser?.role === 'admin' || currentUser?.role === 'staff_finance' || currentUser?.role === 'staff_pa' || currentUser?.role === 'staff_mmk') {
        fetchUsers();
      }
      fetchPrograms();
    }
  }, [currentPage, isLoggedIn, currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await apiCall(API_ENDPOINTS.CURRENT_USER);
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.USERS);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.PROGRAMS);
      setPrograms(data.map(program => {
        const parsedProgram = {
          ...program,
          budget: parseFloat(program.budget) || 0
        };
        return parsedProgram;
      }));
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        setCurrentPage(data.user.role === 'admin' ? 'dashboard' : 'program-management');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentPage');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!currentUser) return null;

    switch (currentPage) {
      case 'dashboard':
        return currentUser.role === 'admin' ? <Dashboard setCurrentPage={setCurrentPage} /> : null;
      case 'user-management':
        return currentUser.role === 'admin' ? <UserManagement users={users} setUsers={setUsers} /> : null;
      case 'program-management':
        return <ProgramManagement 
          programs={programs} 
          setPrograms={setPrograms} 
          currentUser={currentUser}
          users={users}
          setUsers={setUsers}
        />;
      case 'status-tracking':
        return currentUser.role === 'admin' ? <StatusTracking users={users} setUsers={setUsers} programs={programs} setPrograms={setPrograms} currentUser={currentUser} /> : null;
      default:
        return currentUser.role === 'admin' ? <Dashboard setCurrentPage={setCurrentPage} /> : <ProgramManagement programs={programs} setPrograms={setPrograms} currentUser={currentUser} users={users} setUsers={setUsers} />;
    }
  };

  if (!isLoggedIn) {
    if (authScreen === 'forgot') {
      return <ForgotPassword onBack={() => setAuthScreen('login')} />;
    }
    if (authScreen === 'reset') {
      return <ResetPassword onBack={() => setAuthScreen('login')} />;
    }
    return <Login onLogin={handleLogin} onShowForgotPassword={() => setAuthScreen('forgot')} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="/nkn.jpg"
                alt="NKN Logo"
                style={{ width: '56px', height: '56px', marginRight: '16px', display: 'inline-block' }}
              />
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">{t('adminPortal')}</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigationItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => setCurrentPage(item.page)}
                      className={`${
                        currentPage === item.page
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      <div className="flex items-center">
                        {item.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm font-medium">
                {t('user')} - {currentUser?.name || 'Unknown'}
              </div>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
              >
                <option value="en">English</option>
                <option value="ms">Bahasa Malaysia</option>
              </select>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('logout')}
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

function App() {
  return (
    <LanguageProvider>
      <div>
        {/* Logo removed as requested */}
        <AppContent />
      </div>
    </LanguageProvider>
  );
}

export default App; 