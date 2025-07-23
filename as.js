import React, { useState, useEffect } from 'react';

// --- Icons (from lucide-react, simulated as inline SVGs for self-containment) ---
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87l-1-.13a4 4 0 0 0-3 3.87v2"/><circle cx="16" cy="7" r="4"/></svg>
);
const LayoutGridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);
const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h12a2 2 0 0 1 0 4H5a2 2 0 0 0 0 4h12a2 2 0 0 1 0 4h-3"/><path d="M22 7V4a1 1 0 0 0-1-1H3a2 2 0 0 0 0 4h18a1 1 0 0 0 1-1Z"/></svg>
);
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);
const ListChecksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 16 2 2 4-4"/><path d="m3 12 2 2 4-4"/><path d="m3 8 2 2 4-4"/><path d="M11 6h8"/><path d="M11 12h8"/><path d="M11 18h8"/></svg>
);
const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);

// --- Modals ---

// Generic Modal Component (reusable for confirmation, alerts)
const Modal = ({ show, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// Edit User Modal Component
const EditUserModal = ({ show, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    // Update editedUser state when the user prop changes
    setEditedUser(user);
  }, [user]);

  if (!show || !editedUser) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editName" className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              id="editName"
              name="name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedUser.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="editEmail" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="editEmail"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedUser.email || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="editRole" className="block text-gray-700 text-sm font-medium mb-2">Role</label>
            <select
              id="editRole"
              name="role"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedUser.role || 'User'}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Program Manager">Program Manager</option>
              <option value="YB">YB</option> {/* Added YB role */}
            </select>
          </div>
          {editedUser.role === 'YB' && (
            <>
              <div>
                <label htmlFor="editYbName" className="block text-gray-700 text-sm font-medium mb-2">YB Name</label>
                <input
                  type="text"
                  id="editYbName"
                  name="ybName"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={editedUser.ybName || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="editServiceCentre" className="block text-gray-700 text-sm font-medium mb-2">Service Centre (Provision)</label>
                <input
                  type="text"
                  id="editServiceCentre"
                  name="serviceCentre"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={editedUser.serviceCentre || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="editYbStatus" className="block text-gray-700 text-sm font-medium mb-2">YB Administrative Status</label>
                <select
                  id="editYbStatus"
                  name="ybStatus"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={editedUser.ybStatus || 'in review process'}
                  onChange={handleChange}
                >
                  <option value="in review process">In Review Process</option>
                  <option value="complete and can be sent to MMK office">Complete & Sent to MMK Office</option>
                  <option value="complete payment">Complete Payment</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label htmlFor="editStatus" className="block text-gray-700 text-sm font-medium mb-2">Account Status</label>
            <select
              id="editStatus"
              name="status"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedUser.status || 'Active'}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Program Modal Component
const EditProgramModal = ({ show, onClose, program, onSave }) => {
  const [editedProgram, setEditedProgram] = useState(program);

  useEffect(() => {
    setEditedProgram(program);
  }, [program]);

  if (!show || !editedProgram) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProgram);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit Program</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editProgramName" className="block text-gray-700 text-sm font-medium mb-2">Program Name</label>
            <input
              type="text"
              id="editProgramName"
              name="name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedProgram.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="editProgramObjective" className="block text-gray-700 text-sm font-medium mb-2">Objective</label>
            <textarea
              id="editProgramObjective"
              name="objective"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
              value={editedProgram.objective || ''}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="editRecipient" className="block text-gray-700 text-sm font-medium mb-2">Recipient</label>
            <input
              type="text"
              id="editRecipient"
              name="recipient"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedProgram.recipient || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="editBudgetContribution" className="block text-gray-700 text-sm font-medium mb-2">Budget Contribution ($)</label>
            <input
              type="number"
              id="editBudgetContribution"
              name="budgetContribution"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedProgram.budgetContribution || ''}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div>
            <label htmlFor="editProgramStatus" className="block text-gray-700 text-sm font-medium mb-2">Status</label>
            <select
              id="editProgramStatus"
              name="status"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedProgram.status || 'Pending Approval'}
              onChange={handleChange}
            >
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Archived">Archived</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Components ---

// Admin Login Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Simple mock authentication
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const Dashboard = ({ setCurrentPage }) => {
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-md">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="User Management"
          description="Manage user accounts, roles, and permissions."
          icon={<UsersIcon />}
          onClick={() => setCurrentPage('user-management')}
        />
        <DashboardCard
          title="Program Management"
          description="Create, view, and organize application programs."
          icon={<LayoutGridIcon />}
          onClick={() => setCurrentPage('program-management')}
        />
        <DashboardCard
          title="Budget Management"
          description="Oversee budget allocations and track expenses."
          icon={<WalletIcon />}
          onClick={() => setCurrentPage('budget-management')}
        />
        <DashboardCard
          title="Approval Workflow"
          description="Review and approve pending requests and submissions."
          icon={<CheckCircleIcon />}
          onClick={() => setCurrentPage('approval-workflow')}
        />
        <DashboardCard
          title="Status Tracking"
          description="Monitor the real-time status of all operations."
          icon={<ListChecksIcon />}
          onClick={() => setCurrentPage('status-tracking')}
        />
        <DashboardCard
          title="Payment Processing"
          description="Handle invoices, record payments, and process refunds."
          icon={<CreditCardIcon />}
          onClick={() => setCurrentPage('payment-processing')}
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, icon, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="text-blue-600 mb-4 p-3 bg-blue-100 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

// User Management Component
const UserManagement = ({ users, setUsers }) => {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('User');
  const [newYBTName, setNewYBTName] = useState('');
  const [newServiceCentre, setNewServiceCentre] = useState(''); // New state for Service Centre
  const [newYbStatus, setNewYbStatus] = useState('in review process'); // New state for YB Status
  const [feedback, setFeedback] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);


  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      setFeedback('Please fill in Name and Email fields.');
      return;
    }
    const newUser = {
      id: users.length + 1,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      ybName: newYBTName,
      serviceCentre: newServiceCentre, // Save Service Centre
      ybStatus: newUserRole === 'YB' ? newYbStatus : undefined, // Only for YB role
      status: 'Active',
    };
    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('User');
    setNewYBTName('');
    setNewServiceCentre(''); // Clear Service Centre
    setNewYbStatus('in review process'); // Reset YB Status
    setFeedback('User added successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setFeedback(`User ${userToDelete.name} deleted successfully!`);
    setShowDeleteModal(false);
    setUserToDelete(null);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleSaveEditedUser = (updatedUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setFeedback(`User ${updatedUser.name} updated successfully!`);
    setShowEditModal(false);
    setUserToEdit(null);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handlePortfolioAllocation = (ybName) => {
    setFeedback(`Simulating portfolio allocation for YB: ${ybName}. (This would open a new interface/form)`);
    setTimeout(() => setFeedback(''), 4000);
  };


  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Management</h2>

      {feedback && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <span className="block sm:inline">{feedback}</span>
        </div>
      )}

      {/* Add New User Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Register New User</h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="userName" className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              id="userName"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="userEmail"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="userRole" className="block text-gray-700 text-sm font-medium mb-2">Role</label>
            <select
              id="userRole"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Program Manager">Program Manager</option>
              <option value="YB">YB</option> {/* Added YB role */}
            </select>
          </div>
          {newUserRole === 'YB' && (
            <>
              <div>
                <label htmlFor="ybName" className="block text-gray-700 text-sm font-medium mb-2">YB Name</label>
                <input
                  type="text"
                  id="ybName"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newYBTName}
                  onChange={(e) => setNewYBTName(e.target.value)}
                  placeholder="e.g., YB Dato' Seri Anwar Ibrahim"
                  required // YB Name required if role is YB
                />
              </div>
              <div>
                <label htmlFor="serviceCentre" className="block text-gray-700 text-sm font-medium mb-2">Service Centre (Provision)</label>
                <input
                  type="text"
                  id="serviceCentre"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newServiceCentre}
                  onChange={(e) => setNewServiceCentre(e.target.value)}
                  placeholder="e.g., Alor Setar Service Centre"
                  required // Service Centre required if role is YB
                />
              </div>
              <div>
                <label htmlFor="ybInitialStatus" className="block text-gray-700 text-sm font-medium mb-2">YB Admin Status</label>
                <select
                  id="ybInitialStatus"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newYbStatus}
                  onChange={(e) => setNewYbStatus(e.target.value)}
                >
                  <option value="in review process">In Review Process</option>
                  <option value="complete and can be sent to MMK office">Complete & Sent to MMK Office</option>
                  <option value="complete payment">Complete Payment</option>
                </select>
              </div>
            </>
          )}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      {/* Existing Users Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Existing Users</h3>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">YB Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Service Centre</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">YB Admin Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Account Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-4 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{user.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.role}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.ybName || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.serviceCentre || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.ybStatus || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                    {user.role === 'YB' && (
                      <button
                        onClick={() => handlePortfolioAllocation(user.ybName)}
                        className="text-purple-600 hover:underline text-xs"
                      >
                        Allocate Portfolio
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete user ${userToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Edit User Modal */}
      <EditUserModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={userToEdit}
        onSave={handleSaveEditedUser}
      />
    </div>
  );
};

// Program Management Component
const ProgramManagement = ({ programs, setPrograms, setApprovalRequests }) => {
  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramObjective, setNewProgramObjective] = useState('');
  const [recipient, setRecipient] = useState(''); // New: Recipient
  const [budgetContribution, setBudgetContribution] = useState(''); // New: Budget Contribution
  const [praiseExcoFile, setPraiseExcoFile] = useState(null); // New: Praise for EXCO file
  const [centralAccountingFile, setCentralAccountingFile] = useState(null); // New: Central Accounting Booklet file
  const [phApprovalFile, setPhApprovalFile] = useState(null); // New: PH Approval Letter file
  const [feedback, setFeedback] = useState('');

  const [showEditProgramModal, setShowEditProgramModal] = useState(false);
  const [programToEdit, setProgramToEdit] = useState(null);

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [programToArchive, setProgramToArchive] = useState(null);


  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const handleCreateProgram = (e) => {
    e.preventDefault();
    if (!newProgramName || !newProgramObjective || !recipient || !budgetContribution) {
      setFeedback('Please fill in all program details, recipient, and budget.');
      return;
    }
    const newProgram = {
      id: programs.length + 1,
      name: newProgramName,
      objective: newProgramObjective,
      recipient: recipient, // Save recipient
      budgetContribution: parseFloat(budgetContribution), // Save budget
      praiseExcoDoc: praiseExcoFile ? praiseExcoFile.name : 'N/A', // Save file name
      centralAccountingDoc: centralAccountingFile ? centralAccountingFile.name : 'N/A', // Save file name
      phApprovalDoc: phApprovalFile ? phApprovalFile.name : 'N/A', // Save file name
      status: 'Pending Approval',
    };
    setPrograms([...programs, newProgram]);

    // Simulate submission for approval
    const newApprovalRequest = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'Program Approval',
      description: `Approval for new program: ${newProgramName} (Recipient: ${recipient}, Budget: $${budgetContribution})`,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
    };
    setApprovalRequests((prev) => [...prev, newApprovalRequest]);

    // Clear form fields
    setNewProgramName('');
    setNewProgramObjective('');
    setRecipient('');
    setBudgetContribution('');
    setPraiseExcoFile(null);
    setCentralAccountingFile(null);
    setPhApprovalFile(null);

    setFeedback('Program created and submitted for approval!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleEditProgramClick = (program) => {
    setProgramToEdit(program);
    setShowEditProgramModal(true);
  };

  const handleSaveEditedProgram = (updatedProgram) => {
    setPrograms(programs.map((program) => (program.id === updatedProgram.id ? updatedProgram : program)));
    setFeedback(`Program '${updatedProgram.name}' updated successfully!`);
    setShowEditProgramModal(false);
    setProgramToEdit(null);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleArchiveClick = (program) => {
    setProgramToArchive(program);
    setShowArchiveModal(true);
  };

  const confirmArchive = () => {
    if (programToArchive) {
      setPrograms(programs.map((program) =>
        program.id === programToArchive.id ? { ...program, status: 'Archived' } : program
      ));
      setFeedback(`Program '${programToArchive.name}' archived successfully!`);
      setShowArchiveModal(false);
      setProgramToArchive(null);
      setTimeout(() => setFeedback(''), 3000);
    }
  };


  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Program Management</h2>

      {feedback && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <span className="block sm:inline">{feedback}</span>
        </div>
      )}

      {/* Create New Program Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Create New Program Application</h3>
        <form onSubmit={handleCreateProgram} className="space-y-4">
          {/* Program Details */}
          <div>
            <label htmlFor="programName" className="block text-gray-700 text-sm font-medium mb-2">Program Name</label>
            <input
              type="text"
              id="programName"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={newProgramName}
              onChange={(e) => setNewProgramName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="programObjective" className="block text-gray-700 text-sm font-medium mb-2">Objective</label>
            <textarea
              id="programObjective"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
              value={newProgramObjective}
              onChange={(e) => setNewProgramObjective(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="recipient" className="block text-gray-700 text-sm font-medium mb-2">Recipient</label>
            <input
              type="text"
              id="recipient"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="budgetContribution" className="block text-gray-700 text-sm font-medium mb-2">Budget Contribution ($)</label>
            <input
              type="number"
              id="budgetContribution"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={budgetContribution}
              onChange={(e) => setBudgetContribution(e.target.value)}
              required
              min="0"
            />
          </div>

          {/* Approval Documents Upload */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-xl font-semibold text-gray-700 mb-3">Approval Documents (Upload Files)</h4>
            <div className="space-y-3">
              <div>
                <label htmlFor="praiseExco" className="block text-gray-700 text-sm font-medium mb-1">Praise for EXCO</label>
                <input
                  type="file"
                  id="praiseExco"
                  className="w-full text-gray-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleFileChange(setPraiseExcoFile)}
                />
                {praiseExcoFile && <p className="text-xs text-gray-500 mt-1">Selected: {praiseExcoFile.name}</p>}
              </div>
              <div>
                <label htmlFor="centralAccounting" className="block text-gray-700 text-sm font-medium mb-1">Central Accounting Booklet of KHIDM</label>
                <input
                  type="file"
                  id="centralAccounting"
                  className="w-full text-gray-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleFileChange(setCentralAccountingFile)}
                />
                {centralAccountingFile && <p className="text-xs text-gray-500 mt-1">Selected: {centralAccountingFile.name}</p>}
              </div>
              <div>
                <label htmlFor="phApproval" className="block text-gray-700 text-sm font-medium mb-1">PH Approval Letter</label>
                <input
                  type="file"
                  id="phApproval"
                  className="w-full text-gray-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleFileChange(setPhApprovalFile)}
                />
                {phApprovalFile && <p className="text-xs text-gray-500 mt-1">Selected: {phApprovalFile.name}</p>}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 mt-4"
            >
              Create & Submit for Approval
            </button>
          </div>
        </form>
      </div>

      {/* Existing Programs List */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Existing Programs</h3>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Recipient</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Budget</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Approval Docs</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">No programs found.</td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr key={program.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{program.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{program.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{program.recipient}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">${program.budgetContribution.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <ul className="list-disc list-inside text-xs">
                      <li>EXCO: {program.praiseExcoDoc}</li>
                      <li>ACCT: {program.centralAccountingDoc}</li>
                      <li>PH: {program.phApprovalDoc}</li>
                    </ul>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${program.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      program.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                      program.status === 'Archived' ? 'bg-gray-300 text-gray-800' :
                      'bg-red-100 text-red-800'}`}>
                      {program.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <button
                      onClick={() => handleEditProgramClick(program)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchiveClick(program)}
                      className="text-red-600 hover:underline"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Program Modal */}
      <EditProgramModal
        show={showEditProgramModal}
        onClose={() => setShowEditProgramModal(false)}
        program={programToEdit}
        onSave={handleSaveEditedProgram}
      />

      {/* Archive Confirmation Modal */}
      <Modal
        show={showArchiveModal}
        title="Confirm Archive"
        message={`Are you sure you want to archive program '${programToArchive?.name}'? This will mark it as archived.`}
        onConfirm={confirmArchive}
        onCancel={() => setShowArchiveModal(false)}
        confirmText="Archive"
        cancelText="Cancel"
      />
    </div>
  );
};

// Budget Management Component
const BudgetManagement = ({ programs }) => {
  const [budgetCategory, setBudgetCategory] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleAllocateBudget = (e) => {
    e.preventDefault();
    if (!budgetCategory || !allocatedAmount || !selectedProgramId) {
      setFeedback('Please fill in all budget allocation details.');
      return;
    }
    const programName = programs.find(p => p.id === parseInt(selectedProgramId))?.name || 'N/A';
    setFeedback(`Budget of $${allocatedAmount} allocated to '${programName}' for category '${budgetCategory}'. (This is a simulation)`);
    setBudgetCategory('');
    setAllocatedAmount('');
    setSelectedProgramId('');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Budget Management</h2>

      {feedback && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <span className="block sm:inline">{feedback}</span>
        </div>
      )}

      {/* Define Budget Categories (Simplified) */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Allocate Budget to Programs</h3>
        <form onSubmit={handleAllocateBudget} className="space-y-4">
          <div>
            <label htmlFor="budgetCategory" className="block text-gray-700 text-sm font-medium mb-2">Budget Category</label>
            <input
              type="text"
              id="budgetCategory"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Marketing, Operations, Development"
              value={budgetCategory}
              onChange={(e) => setBudgetCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="allocatedAmount" className="block text-gray-700 text-sm font-medium mb-2">Allocated Amount ($)</label>
            <input
              type="number"
              id="allocatedAmount"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(e.target.value)}
              required
              min="0"
            />
          </div>
          <div>
            <label htmlFor="selectProgram" className="block text-gray-700 text-sm font-medium mb-2">Select Program</label>
            <select
              id="selectProgram"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              required
            >
              <option value="">-- Select a Program --</option>
              {programs.filter(p => p.status === 'Approved').map((program) => ( // Only approved programs can receive budget
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Allocate Budget
            </button>
          </div>
        </form>
      </div>

      {/* Simplified Budget Tracking/Reports */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Budget Overview (Simulated)</h3>
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <p className="text-gray-700">This section would show a summary of budget allocation and expense tracking.</p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Total Budget: $1,000,000</li>
          <li>Allocated: $450,000</li>
          <li>Remaining: $550,000</li>
        </ul>
        <button className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-200">
          Generate Detailed Reports
        </button>
      </div>
    </div>
  );
};

// Approval Workflow Component
const ApprovalWorkflow = ({ approvalRequests, setApprovalRequests, setPrograms }) => {
  const handleApprove = (id) => {
    setApprovalRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Approved' } : req))
    );
    // If it's a program approval, update program status
    const approvedRequest = approvalRequests.find(req => req.id === id);
    if (approvedRequest && approvedRequest.type === 'Program Approval') {
        // Extract program name from description (basic parsing)
        const match = approvedRequest.description.match(/Approval for new program: ([^ (]+)/);
        const programName = match ? match[1] : null;

        if (programName) {
            setPrograms((prevPrograms) =>
                prevPrograms.map((program) =>
                    program.name === programName ? { ...program, status: 'Approved' } : program
                )
            );
        }
    }
  };

  const handleReject = (id) => {
    setApprovalRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Rejected' } : req))
    );
    // If it's a program rejection, update program status
    const rejectedRequest = approvalRequests.find(req => req.id === id);
    if (rejectedRequest && rejectedRequest.type === 'Program Approval') {
        const match = rejectedRequest.description.match(/Approval for new program: ([^ (]+)/);
        const programName = match ? match[1] : null;

        if (programName) {
            setPrograms((prevPrograms) =>
                prevPrograms.map((program) =>
                    program.name === programName ? { ...program, status: 'Rejected' } : program
                )
            );
        }
    }
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Approval Workflow</h2>

      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Pending Requests</h3>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Type</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Description</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvalRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">No approval requests.</td>
              </tr>
            ) : (
              approvalRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{request.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{request.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{request.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{request.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {request.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-md mr-2 transition duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-md transition duration-200"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Status Tracking Component
const StatusTracking = ({ users, setUsers, programs, setPrograms, payments }) => {
  const [feedback, setFeedback] = useState('');

  // Function to update user status
  const handleUserStatusChange = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setFeedback(`User account status updated for ID ${userId} to '${newStatus}'.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  // Function to update YB administrative status
  const handleYbStatusChange = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ybStatus: newStatus } : user
      )
    );
    setFeedback(`YB administrative status updated for ID ${userId} to '${newStatus}'.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  // Function to update program status
  const handleProgramStatusChange = (programId, newStatus) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) =>
        program.id === programId ? { ...program, status: newStatus } : program
      )
    );
    setFeedback(`Program status updated for ID ${programId} to '${newStatus}'.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Status Tracking Overview</h2>

      {feedback && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <span className="block sm:inline">{feedback}</span>
        </div>
      )}

      {/* User Status Section */}
      <h3 className="2xl font-semibold text-gray-700 mb-4">User Account Statuses</h3>
      <div className="overflow-x-auto rounded-lg shadow-lg mb-8">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">YB Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Service Centre</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">YB Admin Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Account Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Change Account Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Change YB Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-4 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{user.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.role}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.ybName || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{user.serviceCentre || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.role === 'YB' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${user.ybStatus === 'complete payment' ? 'bg-green-100 text-green-800' :
                          user.ybStatus === 'in review process' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {user.ybStatus}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                        user.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <select
                      value={user.status}
                      onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                      className="p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {user.role === 'YB' ? (
                      <select
                        value={user.ybStatus || 'in review process'}
                        onChange={(e) => handleYbStatusChange(user.id, e.target.value)}
                        className="p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="in review process">In Review Process</option>
                        <option value="complete and can be sent to MMK office">Complete & Sent to MMK Office</option>
                        <option value="complete payment">Complete Payment</option>
                      </select>
                    ) : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Program Status Section */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Program Statuses</h3>
      <div className="overflow-x-auto rounded-lg shadow-lg mb-8">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Recipient</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Budget</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Current Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">No programs found.</td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr key={program.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{program.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{program.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{program.recipient}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">${program.budgetContribution.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${program.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        program.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {program.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <select
                      value={program.status}
                      onChange={(e) => handleProgramStatusChange(program.id, e.target.value)}
                      className="p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Archived">Archived</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Status Section (View Only) */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Payment Statuses (View Only)</h3>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Invoice ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Voucher</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">No payments recorded.</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{payment.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{payment.invoiceId}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">${payment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{payment.paymentVoucher}</td> {/* Display voucher name */}
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'Refunded' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">{payment.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Payment Processing Component
const PaymentProcessing = ({ payments, setPayments }) => {
  const [invoiceId, setInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentVoucherFile, setPaymentVoucherFile] = useState(null); // New: Payment Voucher File
  const [feedback, setFeedback] = useState('');

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!invoiceId || !paymentAmount) {
      setFeedback('Please fill in invoice ID and amount.');
      return;
    }
    const newPayment = {
      id: payments.length + 1,
      invoiceId: invoiceId,
      amount: parseFloat(paymentAmount),
      status: paymentStatus,
      paymentVoucher: paymentVoucherFile ? paymentVoucherFile.name : 'N/A', // Save file name
      date: new Date().toLocaleDateString(),
    };
    setPayments([...payments, newPayment]);
    setInvoiceId('');
    setPaymentAmount('');
    setPaymentStatus('Pending');
    setPaymentVoucherFile(null); // Clear file input
    setFeedback('Payment recorded successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Payment Processing</h2>

      {feedback && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <span className="block sm:inline">{feedback}</span>
        </div>
      )}

      {/* Record Payment Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Record New Payment</h3>
        <form onSubmit={handleRecordPayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="invoiceId" className="block text-gray-700 text-sm font-medium mb-2">Invoice ID</label>
            <input
              type="text"
              id="invoiceId"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="paymentAmount" className="block text-gray-700 text-sm font-medium mb-2">Amount ($)</label>
            <input
              type="number"
              id="paymentAmount"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="paymentStatus" className="block text-gray-700 text-sm font-medium mb-2">Payment Status</label>
            <select
              id="paymentStatus"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="paymentVoucher" className="block text-gray-700 text-sm font-medium mb-1">Payment Voucher (Upload File)</label>
            <input
              type="file"
              id="paymentVoucher"
              className="w-full text-gray-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange(setPaymentVoucherFile)}
            />
            {paymentVoucherFile && <p className="text-xs text-gray-500 mt-1">Selected: {paymentVoucherFile.name}</p>}
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 mt-4"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>

      {/* Existing Payments Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Payment History</h3>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Invoice ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Voucher</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">No payments recorded.</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{payment.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{payment.invoiceId}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">${payment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{payment.paymentVoucher}</td> {/* Display voucher name */}
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'Refunded' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">{payment.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'user-management', etc.

  // --- Mock Data States ---
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', ybName: 'N/A', serviceCentre: 'N/A', status: 'Active', ybStatus: undefined },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', ybName: 'N/A', serviceCentre: 'N/A', status: 'Active', ybStatus: undefined },
    { id: 3, name: 'YB Dato\' Malik', email: 'yb.malik@example.com', role: 'YB', ybName: 'YB Dato\' Malik', serviceCentre: 'Shah Alam Service Centre', status: 'Active', ybStatus: 'complete and can be sent to MMK office' },
    { id: 4, name: 'YB Tan Sri Lim', email: 'yb.lim@example.com', role: 'YB', ybName: 'YB Tan Sri Lim', serviceCentre: 'Kuala Lumpur Service Centre', status: 'Active', ybStatus: 'in review process' },
  ]);

  const [programs, setPrograms] = useState([
    { id: 101, name: 'Community Outreach', objective: 'Engage local communities.', recipient: 'Local Residents', budgetContribution: 5000.00, praiseExcoDoc: 'exco_praise_2024.pdf', centralAccountingDoc: 'acc_booklet_comm.xlsx', phApprovalDoc: 'ph_approval_comm.pdf', status: 'Approved' },
    { id: 102, name: 'Skill Development Workshop', objective: 'Provide free skill training.', recipient: 'Unemployed Youth', budgetContribution: 2500.00, praiseExcoDoc: 'N/A', centralAccountingDoc: 'N/A', phApprovalDoc: 'N/A', status: 'Pending Approval' },
  ]);

  const [approvalRequests, setApprovalRequests] = useState([
    { id: 'req123', type: 'Budget Increase', description: 'Request for marketing budget increase for Community Outreach.', status: 'Pending', date: '2024-05-15' },
    { id: 'req124', type: 'Program Approval', description: 'Approval for new program: Skill Development Workshop (Recipient: Unemployed Youth, Budget: $2500)', status: 'Pending', date: '2024-06-01' },
  ]);

  const [payments, setPayments] = useState([
    { id: 201, invoiceId: 'INV001', amount: 1500.00, status: 'Paid', paymentVoucher: 'voucher_001.pdf', date: '2024-04-20' },
    { id: 202, invoiceId: 'INV002', amount: 300.00, status: 'Pending', paymentVoucher: 'N/A', date: '2024-05-10' },
  ]);
  // --- End Mock Data States ---

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard'); // Reset to dashboard or login
  };

  if (!isLoggedIn) {
    return <Login onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-inter bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center z-10">
        <div className="flex items-center">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center text-lg font-bold text-white hover:text-blue-300 transition duration-200 mr-6"
          >
            <HomeIcon className="mr-2" /> Admin Portal
          </button>
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => setCurrentPage('user-management')} className="hover:text-blue-300 transition duration-200">
              Users
            </button>
            <button onClick={() => setCurrentPage('program-management')} className="hover:text-blue-300 transition duration-200">
              Programs
            </button>
            <button onClick={() => setCurrentPage('budget-management')} className="hover:text-blue-300 transition duration-200">
              Budget
            </button>
            <button onClick={() => setCurrentPage('approval-workflow')} className="hover:text-blue-300 transition duration-200">
              Approvals
            </button>
            <button onClick={() => setCurrentPage('status-tracking')} className="hover:text-blue-300 transition duration-200">
              Status
            </button>
            <button onClick={() => setCurrentPage('payment-processing')} className="hover:text-blue-300 transition duration-200">
              Payments
            </button>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 transform hover:scale-105"
        >
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Render content based on currentPage state */}
          {(() => {
            switch (currentPage) {
              case 'dashboard':
                return <Dashboard setCurrentPage={setCurrentPage} />;
              case 'user-management':
                return <UserManagement users={users} setUsers={setUsers} />;
              case 'program-management':
                return <ProgramManagement programs={programs} setPrograms={setPrograms} setApprovalRequests={setApprovalRequests} />;
              case 'budget-management':
                return <BudgetManagement programs={programs} />;
              case 'approval-workflow':
                return <ApprovalWorkflow approvalRequests={approvalRequests} setApprovalRequests={setApprovalRequests} setPrograms={setPrograms} />;
              case 'status-tracking':
                return <StatusTracking users={users} setUsers={setUsers} programs={programs} setPrograms={setPrograms} payments={payments} />;
              case 'payment-processing':
                return <PaymentProcessing payments={payments} setPayments={setPayments} />;
              default:
                return <Dashboard setCurrentPage={setCurrentPage} />;
            }
          })()}
        </div>
      </main>
    </div>
  );
}
