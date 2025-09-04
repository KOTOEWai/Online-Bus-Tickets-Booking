/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, AlertCircle, Loader2, Clock,
} from 'lucide-react';

import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import { messageVariants, containerVariants, itemVariants } from '../hooks/useAnimationVariants';
import { getNotificationTypeProps } from '../constants/locations';
import { useGetNotificationQuery, useMarkNotificationAsReadMutation } from '../service/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { showNotification, clearNotification } from '../service/notificationSlice';

const NotificationsPage: React.FC = () => {
 const dispatch = useDispatch();
const { message, type } = useSelector((state: RootState) => state.notification);
  const currentUserId = localStorage.getItem('userId'); 

  // RTK query
  const { data: notifications = [], isLoading, isError, error } = 
    useGetNotificationQuery({ user_id: currentUserId || '' }, { skip: !currentUserId });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  //const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

const handleMarkAsRead = async (id: number) => {
  try {
    const res = await markAsRead({ notification_id: id, user_id: currentUserId! }).unwrap();
    dispatch(showNotification({ type: 'success', message: res.message || "Marked as read!" }));
    setTimeout(() => dispatch(clearNotification()), 1000);
  } catch (err: any) {
    dispatch(showNotification({ type: 'error', message: "Failed to mark as read." }));
    setTimeout(() => dispatch(clearNotification()), 1000);
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />

      <div className="container mx-auto flex-grow py-8 px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 flex items-center justify-center gap-3">
          <Bell className="w-8 h-8 text-orange-500" /> Your Notifications
        </h1>

        {/* Action Messages */}
     <AnimatePresence>
  {message && (
    <motion.div
      className={`p-3 rounded-lg text-sm mb-6 flex items-center gap-2 ${
        type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
      }`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
      {message}
    </motion.div>
  )}
</AnimatePresence>


        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
            <p className="font-semibold">Error:</p>
            <p>{JSON.stringify(error)}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md text-sm text-center">
            <AlertCircle className="inline-block w-5 h-5 mr-2" />
            <p className="font-semibold">No new notifications.</p>
            <p>Check back later for updates!</p>
          </div>
        ) : (
          <motion.div
            className="space-y-4 mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {notifications.map((notification: any) => {
              const { icon: Icon, color, bgColor, badgeText } = getNotificationTypeProps(notification.type);
              return (
                <motion.div
                  key={notification.notification_id}
                  variants={itemVariants}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                    notification.is_read
                      ? 'bg-gray-50 border border-gray-200 opacity-80'
                      : 'bg-white shadow-lg border-l-4 border-blue-500'
                  } hover:shadow-xl`}
                >
                  {/* Icon + Badge */}
                  <div className={`flex flex-col items-center justify-center p-2 rounded-full ${bgColor} ${color} flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                    <span className={`text-[10px] sm:text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${color} ${bgColor.replace('100', '200')}`}>
                      {badgeText}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow w-full">
                    <h3 className={`text-base sm:text-lg font-semibold leading-tight ${notification.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm sm:text-base mt-1 ${notification.is_read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex flex-col sm:items-end sm:ml-auto mt-2 sm:mt-0 w-full p-2.5 sm:w-auto">
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 text-xs text-gray-500 items-center">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                      <span>{new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {!notification.is_read && (
                      <span
                        onClick={() => handleMarkAsRead(notification.notification_id)}
                        className="mt-3 sm:mt-2 cursor-pointer py-2 px-2.5 text-center text-sm font-light bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow transition-all duration-300"
                      >
                        Mark as Read
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
