import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  // Mock data for static preview
  const mockCurrentUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  };

  const mockPrograms = [
    {
      id: 1,
      name: 'Community Development Program',
      budget: 50000,
      recipientName: 'Community Center',
      status: 'approved',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z'
    },
    {
      id: 2,
      name: 'Youth Education Initiative',
      budget: 25000,
      recipientName: 'Local School',
      status: 'pending',
      created_at: '2024-01-18T09:15:00Z',
      updated_at: '2024-01-18T09:15:00Z'
    },
    {
      id: 3,
      name: 'Healthcare Support Program',
      budget: 75000,
      recipientName: 'Medical Clinic',
      status: 'under_review',
      created_at: '2024-01-20T11:45:00Z',
      updated_at: '2024-01-22T16:20:00Z'
    },
    {
      id: 4,
      name: 'Environmental Conservation',
      budget: 30000,
      recipientName: 'Green Foundation',
      status: 'approved',
      created_at: '2024-01-25T08:30:00Z',
      updated_at: '2024-01-28T12:15:00Z'
    },
    {
      id: 5,
      name: 'Senior Care Program',
      budget: 40000,
      recipientName: 'Elder Care Center',
      status: 'rejected',
      created_at: '2024-02-01T14:20:00Z',
      updated_at: '2024-02-05T09:45:00Z'
    },
    {
      id: 6,
      name: 'Technology Training',
      budget: 35000,
      recipientName: 'Tech Institute',
      status: 'draft',
      created_at: '2024-02-10T16:00:00Z',
      updated_at: '2024-02-10T16:00:00Z'
    }
  ];

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
                  <button className="bg-blue-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </button>
                  <button className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Apply Program
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <span className="font-medium">{mockCurrentUser.name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-600 rounded-full text-xs">
                  {mockCurrentUser.role.toUpperCase()}
                </span>
              </div>
              <button
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
          <Dashboard programs={mockPrograms} currentUser={mockCurrentUser} setCurrentPage={() => {}} />
        </div>
      </main>
    </div>
  );
}

export default App;