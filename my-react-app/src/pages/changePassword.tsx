/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import { cardVariants, messageVariants, itemVariants } from '../hooks/useAnimationVariants';
import { useChangePasswordMutation } from '../service/apiSlice';


const ChangePasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const currentUserId = localStorage.getItem('userId');

  // RTK Query Mutation Hook
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    if (!currentUserId) {
      setMessageType('error');
      setMessage('User not logged in. Please log in to change your password.');
      return;
    }
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setMessageType('error');
      setMessage('All fields are required.');
      return;
    }
    if (formData.newPassword.length < 8) {
      setMessageType('error');
      setMessage('New password must be at least 8 characters long.');
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessageType('error');
      setMessage('New password and confirm password do not match.');
      return;
    }

    try {
      const result = await changePassword({
        user_id: currentUserId,
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      }).unwrap();

      if (result.success) {
        setMessageType('success');
        setMessage('Password changed successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setMessageType('error');
        setMessage(result.message || 'Failed to change password. Please check your current password.');
      }
    } catch (err: any) {
      setMessageType('error');
      setMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />
      <div className="container mx-auto flex-grow py-8 px-4 md:px-6 flex items-center justify-center">
        <motion.div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md"
          variants={cardVariants} initial="hidden" animate="visible">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <Key className="w-8 h-8 text-purple-600" /> Change Password
          </h1>

          <AnimatePresence>
            {message && (
              <motion.div
                className={`p-3 rounded-lg text-sm mb-6 flex items-center gap-2 ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                variants={messageVariants} initial="hidden" animate="visible" exit="exit"
              >
                {messageType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <motion.div className="relative" variants={itemVariants}>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg"
                placeholder="Enter current password"
              />
            </motion.div>
            {/* New Password */}
            <motion.div className="relative" variants={itemVariants}>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg"
                placeholder="Enter new password"
              />
            </motion.div>
            {/* Confirm New Password */}
            <motion.div className="relative" variants={itemVariants}>
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg"
                placeholder="Confirm new password"
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
              disabled={isLoading}
              variants={itemVariants}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Changing...</>
              ) : (
                <><Lock className="w-5 h-5" /> Change Password</>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePasswordPage;
