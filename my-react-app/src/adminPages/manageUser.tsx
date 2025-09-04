/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Users, UserPlus, Edit, Trash2, Loader2, X, CheckCircle, AlertCircle,
  Send
} from 'lucide-react';


import AdminSidebar from '../components/adminNav';

// --- Interfaces ---
interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  created_at: string;
}

// Interface for form data (password is optional for update)
interface UserFormData {
  user_id?: number; // Optional for new users
  full_name: string;
  email: string;
  password?: string; // Optional for updates
  phone: string;
  role: 'user' | 'admin';
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // User being edited/deleted
  const [formData, setFormData] = useState<UserFormData>({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // --- Fetch Users ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/readUsers.php`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users.');
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err:any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'An unexpected error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Modal Management ---
  const openAddModal = () => {
    setCurrentUser(null);
    setFormData({
      full_name: '',
      email: '',
      password: '', // Password is required for new user
      phone: '',
      role: 'user',
    });
    setFormStatus('idle');
    setFormMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setFormData({
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      password: '', // Password is optional for edit; leave empty unless changing
      phone: user.phone,
      role: user.role,
    });
    setFormStatus('idle');
    setFormMessage(null);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsConfirmModalOpen(false);
    setCurrentUser(null);
    setFormStatus('idle');
    setFormMessage(null);
  };

  // --- Form Handling ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormMessage(null);

    const isEditing = currentUser !== null;
    const url = isEditing
      ? `${import.meta.env.VITE_API_BASE_URL}/admin/users/updateUser.php`
      : `${import.meta.env.VITE_API_BASE_URL}/admin/users/createUser.php`;
    const method = 'POST'; // Both create and update will use POST

    // Prepare payload, remove password if empty during update
    const payload = { ...formData };
    if (isEditing && payload.password === '') {
      delete payload.password; // Don't send empty password for update
    } else if (!isEditing && !payload.password) {
      setFormStatus('error');
      setFormMessage('Password is required for new users.');
      return;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus('success');
        setFormMessage(result.message || `User ${isEditing ? 'updated' : 'created'} successfully!`);
        fetchUsers(); // Refresh user list
        setTimeout(() => closeModals(), 1500); // Close modal after a short delay
      } else {
        setFormStatus('error');
        setFormMessage(result.message || `Failed to ${isEditing ? 'update' : 'create'} user.`);
      }
    } catch (err: any) {
      console.error('Save user error:', err);
      setFormStatus('error');
      setFormMessage(err.message || 'An unexpected error occurred.');
    }
  };

  // --- Delete User ---
  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!currentUser) return;

    setLoading(true); // Show global loading for delete operation
    closeModals(); // Close confirmation modal immediately

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/removeUser.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.user_id }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message || 'User deleted successfully!'); // Use custom alert if available
        fetchUsers(); // Refresh user list
      } else {
        alert(result.message || 'Failed to delete user.'); // Use custom alert if available
      }
    } catch (err: any) {
      console.error('Delete user error:', err);
      alert(err.message || 'An unexpected error occurred during deletion.');
    } finally {
      setLoading(false);
      setCurrentUser(null); // Clear current user
    }
  };

  // --- Send Notification ---
  const handleSendNoti = (user: User) => {
    // Redirect to SendNoti page with user ID
    window.location.href = `/SendNoti?user_id=${user.user_id}`;
  
  }



  // --- Framer Motion Variants ---
  const pageTitleVariants: Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 1, 0.3, 1] } },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 1, 0.3, 1], delay: 0.2 } },
  };



  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <AdminSidebar>
    <div className="min-h-screen  font-sans text-gray-800">
      

      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        {/* Page Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={pageTitleVariants}
        >
          <Users className="w-10 h-10 mr-4 text-blue-600" /> User Management
        </motion.h1>

        {/* Add User Button */}
        <motion.div
          className="flex justify-end mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <UserPlus className="w-5 h-5" /> Add New User
          </button>
        </motion.div>

        {/* Users Table */}
        <motion.section
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-700" /> All Users
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="mt-4 text-lg text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
              <strong className="font-bold">Error:</strong> {error}
            </div>
          ) : users.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md text-center">
              <strong className="font-bold">No Users Found.</strong> Click "Add New User" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.user_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 gap-3">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>

                           <button
                            onClick={() => handleSendNoti(user)}
                            className="text-green-700 hover:text-red-900 flex items-center gap-1"
                            title="Delete User"
                          >
                            <Send className="w-4 h-4" /> Send-Noti
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password {currentUser ? '(Leave blank to keep current)' : ''}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={!currentUser} // Required only for new users
                  disabled={!!currentUser} // Disable for existing users
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formStatus === 'error' && formMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> {formMessage}
                </div>
              )}
              {formStatus === 'success' && formMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> {formMessage}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" /> {currentUser ? 'Update User' : 'Add User'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Modal for Delete */}
      {isConfirmModalOpen && currentUser && (
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm relative text-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete user "<span className="font-semibold">{currentUser.full_name}</span>" (ID: {currentUser.user_id})? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeModals}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" /> Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
    </AdminSidebar>
  );
};

export default UserManagementPage;
