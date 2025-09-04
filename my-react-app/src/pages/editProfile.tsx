/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence  } from 'framer-motion';
import {
  User, Mail,  Loader2, AlertCircle, CheckCircle, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import { cardVariants, messageVariants, itemVariants } from '../hooks/useAnimationVariants';
import type { UserInfo } from '../interfaces/types';
import {   useGetUserProfileQuery,
  useUpdateUserProfileMutation } from '../service/apiSlice';


const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<UserInfo>>({
    username: '',
    email: '',
    // phone: '', // If you add phone to UserInfo and users table
  });
  
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  // Get current user ID from local storage (replace with actual auth context)
  const currentUserId = localStorage.getItem('userId')|| '';

 const { data:userInfo, error, isLoading:loading  } = useGetUserProfileQuery(currentUserId)
 const [updateUserProfile, { isLoading: submitting }] = useUpdateUserProfileMutation();
useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.full_name,
        email: userInfo.email,
      });
    }
  }, [userInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    try {
      const res = await updateUserProfile({
        user_id: currentUserId,
        name: formData.username || '',
        email: formData.email || '',
      }).unwrap();

      if (res.success) {
        setMessageType('success');
        setMessage('Profile updated successfully!');
        localStorage.setItem('user_name', formData.username || '');
        localStorage.setItem('user_email', formData.email || '');
        setTimeout(() => navigate('/profileDetail'), 2000);
      } else {
        setMessageType('error');
        setMessage(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setMessageType('error');
      setMessage(err?.data?.message || 'Unexpected error occurred.');
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />

      <div className="container mx-auto flex-grow py-8 px-4 md:px-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <User className="w-8 h-8 text-blue-600" /> Edit Profile
          </h1>

          <AnimatePresence>
            {message && (
              <motion.div
                className={`p-3 rounded-lg text-sm mb-6 flex items-center gap-2 ${
                  messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {messageType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
              <p className="text-gray-600">Loading profile data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
              <AlertCircle className="inline-block w-5 h-5 mr-2" />
              <strong className="font-bold">Error:</strong>  {(error as any)?.data?.message}
              <p className="mt-2 text-sm">Please ensure you are logged in and try refreshing the page.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <motion.div className="relative" variants={itemVariants}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-transparent"
                  placeholder="Enter your username"
                  required
                />
                <label
                  htmlFor="username"
                  className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Username
                </label>
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500" />
              </motion.div>

              {/* Email Field */}
              <motion.div className="relative" variants={itemVariants}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-transparent"
                  placeholder="Enter your email"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Email
                </label>
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500" />
              </motion.div>

              {/* Phone Field (Commented out as per tickets.sql, add if you modify your 'users' table) */}
              {/*
              <motion.div className="relative" variants={itemVariants}>
                <input
                  type="tel" // Use 'tel' for phone numbers
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-transparent"
                  placeholder="Enter your phone number"
                  // required // Make required if applicable
                />
                <label
                  htmlFor="phone"
                  className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Phone Number
                </label>
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500" />
              </motion.div>
              */}

              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                variants={itemVariants}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Changes
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfilePage;
