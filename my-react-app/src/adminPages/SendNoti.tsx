/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Send, Loader2, AlertCircle, CheckCircle, MessageSquare,
  User
} from 'lucide-react';
import AdminSidebar from '../components/adminNav';
import { cardVariants, messageVariants, itemVariants } from '../hooks/useAnimationVariants';
import { useLocation } from 'react-router-dom';
const AdminNotificationsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId =  queryParams.get('user_id'); // Get user_id from query params
  const adminUserId = localStorage.getItem('userId'); // Get admin's user_id
  const [formData, setFormData] = useState({
    title: '',
    message: '',
     type:'',
    target_user_id : userId 
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    if (!formData.title.trim() || !formData.message.trim()) {
      setActionMessage({ type: 'error', text: 'Title and message cannot be empty.' });
      setSubmitting(false);
      return;
    }

    if (!adminUserId) {
        setActionMessage({ type: 'error', text: 'Admin user ID not found. Please log in as admin.' });
        setSubmitting(false);
        return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sendPromotionNotification.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
          admin_user_id: parseInt(adminUserId), // Ensure it's an integer
          type: formData.type,
          target_user_id: formData.target_user_id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: data.message });
        setFormData({ title: '', message: '', type:'' ,target_user_id: userId }); // Clear form
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Failed to send notifications.' });
      }
    } catch (error: any) {
      console.error("Error sending notification:", error);
      setActionMessage({ type: 'error', text: 'An unexpected error occurred. Please try again later.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionMessage(null), 5000); // Clear message after 5 seconds
    }
  };
  return (
    <AdminSidebar>
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-100 font-sans text-gray-800">
     

      <div className="container mx-auto flex-grow py-8 px-4 md:px-6 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-lg"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
            <Bell className="w-8 h-8 text-purple-600" /> Send Promotion Notifications
          </h1>

          <AnimatePresence>
            {actionMessage && (
              <motion.div
                className={`p-3 rounded-lg text-sm mb-6 flex items-center gap-2 ${
                  actionMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {actionMessage.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                {actionMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notification Title */}
            <motion.div className="relative" variants={itemVariants}>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-transparent"
                placeholder="e.g., New Year Discount!"
                required
              />
              <label
                htmlFor="title"
                className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600"
              >
                Notification Title
              </label>
              <Bell className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-purple-500" />
            </motion.div>

            {/* Notification Type (Dropdown) */}
            <motion.div className="relative" variants={itemVariants}>
            <label
                htmlFor="title"
                className=" left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600"
              >Notification Type:</label>
            <select
            id='type'
            name='type'
          value={formData.type}
          onChange={handleChange}
        className="w-full  p-2 border rounded mb-1"
        
          >
        <option value="" disabled selected>Select Notification Type</option>
        <option value="message">Message</option>
        <option value="price_alert">Price Alert</option>
        <option value="update">Update</option>
        <option value="news">News</option>
        <option value="event">Event</option>
        <option value="offer">Offer</option>
        <option value="announcement">Announcement</option>
        <option value="reminder">Reminder</option>
        <option value="feedback">Feedback</option>
        <option value="survey">Survey</option>
        <option value="newsletter">Newsletter</option>
        <option value="feature">Feature</option>
        <option value="promotion">Promotion</option>
        <option value="booking">Booking</option>
        <option value="info">Info</option>
        <option value="urgent">Urgent</option>
      </select>
    </motion.div>
            {/* Notification Message */}
            <motion.div className="relative" variants={itemVariants}>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-transparent resize-y"
                placeholder="Detailed message for the promotion..."
                required
              ></textarea>
              <label
                htmlFor="message"
                className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600"
              >
                Notification Message
              </label>
              <MessageSquare className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-purple-500" />
            </motion.div>

            {/* Target Group (for future expansion, currently defaults to all_users in backend) */}
           <motion.div className="relative" variants={itemVariants}>
              <input
                type="text"
                id="user_id"
                name="user_id"
                value={formData.target_user_id || ''}
                onChange={handleChange}
                className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-transparent"
              />
              <label
                htmlFor="user_id"
                className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600"
              >
                {userId ? `Target User ID: ${userId}` : 'Target Group (default: all users)'}
              </label>
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-purple-500" />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-purple-400 disabled:cursor-not-allowed"
              variants={itemVariants}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                </>
              ):(
                <>
                  <Send className="w-5 h-5" /> Send Notifications
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

     
    </div>
    </AdminSidebar>
  );
};

export default AdminNotificationsPage;
