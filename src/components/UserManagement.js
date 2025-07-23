import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Generic Modal Component
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
  const { t } = useLanguage();

  React.useEffect(() => {
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
        <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('editUser')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editName" className="block text-gray-700 text-sm font-medium mb-2">{t('name')}</label>
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
            <label htmlFor="editEmail" className="block text-gray-700 text-sm font-medium mb-2">{t('email')}</label>
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
            <label htmlFor="editPassword" className="block text-gray-700 text-sm font-medium mb-2">{t('password')}</label>
            <input
              type="password"
              id="editPassword"
              name="password"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedUser.password || ''}
              onChange={handleChange}
              placeholder={t('leaveBlankToKeepCurrent')}
            />
          </div>
          <div>
            <label htmlFor="editRole" className="block text-gray-700 text-sm font-medium mb-2">{t('role')}</label>
            <select
              id="editRole"
              name="role"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={editedUser.role || 'user'}
              onChange={handleChange}
            >
              <option value="user">{t('user')}</option>
              <option value="admin">{t('admin')}</option>
              <option value="staff_finance">{t('staff_finance')}</option>
              <option value="staff_pa">{t('staff_pa')}</option>
              <option value="staff_mmk">Staff MMK</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              {t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = ({ users, setUsers }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    excoLocation: '',
    contactNo: '',
    picture: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const { t } = useLanguage();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser({ ...newUser, picture: file });
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Create new user with mock ID
      const newUserData = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        excoLocation: newUser.excoLocation,
        contactNo: newUser.contactNo,
        picture: newUser.picture ? newUser.picture.name : null,
        created_at: new Date().toISOString()
      };
      
      setUsers([...users, newUserData]);
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user',
        excoLocation: '',
        contactNo: '',
        picture: null
      });
      setPreviewImage(null);
      setSuccess('User registered successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to register user');
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
        setSuccess(t('userDeletedSuccessfully'));
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToDeleteUser'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(t('failedToConnectToServer'));
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveEditedUser = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(users.map(u => u.id === data.id ? data : u));
        setShowEditModal(false);
        setSelectedUser(null);
        setSuccess(t('userUpdatedSuccessfully'));
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToUpdateUser'));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError(t('failedToConnectToServer'));
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{t('userManagement')}</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('Add User')}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        {t('NAME')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('EMAIL')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        {t('ROLE')}
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">{t('actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{t(user.role)}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t('delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">User Registration</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <label className="mt-4 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                  Upload Picture *
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    placeholder="Enter email address"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">Role *</label>
                  <select
                    id="role"
                    name="role"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="exco">EXCO</option>
                    <option value="admin">Admin</option>
                    <option value="staff_finance">Staff Finance</option>
                    <option value="staff_pa">Staff PA</option>
                    <option value="staff_mmk">Staff MMK</option>
                  </select>
                </div>

                {/* EXCO Location */}
                <div>
                  <label htmlFor="excoLocation" className="block text-gray-700 text-sm font-medium mb-2">EXCO Location</label>
                  <input
                    type="text"
                    id="excoLocation"
                    name="excoLocation"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.excoLocation}
                    onChange={(e) => setNewUser({ ...newUser, excoLocation: e.target.value })}
                    placeholder="Enter EXCO location"
                  />
                </div>

                {/* Budget Contribution */}

                {/* Contact Number */}
                <div>
                  <label htmlFor="contactNo" className="block text-gray-700 text-sm font-medium mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    id="contactNo"
                    name="contactNo"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.contactNo}
                    onChange={(e) => setNewUser({ ...newUser, contactNo: e.target.value })}
                    required
                    placeholder="Enter contact number"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setPreviewImage(null);
                    setNewUser({
                      name: '',
                      email: '',
                      password: '',
                      role: 'user',
                      excoLocation: '',
                      contactNo: '',
                      picture: null
                    });
                  }}
                  className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal - OLD VERSION REMOVED */}
      {false && showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('Add New User')}</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">{t('Name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">{t('Email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">{t('Password')}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">{t('Role')}</label>
                <select
                  id="role"
                  name="role"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="user">{t('user')}</option>
                  <option value="admin">{t('admin')}</option>
                  <option value="staff_finance">{t('staff_finance')}</option>
                  <option value="staff_pa">{t('staff_pa')}</option>
                  <option value="staff_mmk">Staff MMK</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                >
                  {t('Add User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={selectedUser}
          onSave={handleSaveEditedUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        title={t('confirmDelete')}
        message={t('deleteUserConfirmation', { name: selectedUser?.name })}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText={t('delete')}
        cancelText={t('cancel')}
      />
    </div>
  );
};

export default UserManagement; 