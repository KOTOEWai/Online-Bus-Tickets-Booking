import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Menu, X, LogOut, LogIn, User, // Added missing icons
 
} from 'lucide-react';

// Assuming getUserRole is defined in '../utils/auth'
import { getUserRole } from '../utils/auth';
import ChatBot from './chatBot'; // Assuming ChatBot is a component you want to render somewhere
import { ProfileModal } from './ui/profileModal';
import { menuItems, profileMenuItems } from '../constants/locations';
import { useGetNotificationQuery } from '../service/apiSlice';




const UserNavbar: React.FC = () => {
  const role = getUserRole(); // e.g., 'user', 'admin', or null
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
//  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0); // New state for unread count
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To highlight active link
  // Get user info from localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userName = localStorage.getItem('user_name') || 'Guest';
  const userEmail = localStorage.getItem('email') || 'N/A'; // Assuming you store email
  const userId = localStorage.getItem('userId'); // Get user ID for fetching notifications

  const handleLogout = () => {
   
  setShowProfileModal(false); // Close profile modal if open
  setDrawerOpen(false); // Close drawer if open
   localStorage.removeItem('isLoggedIn');
   localStorage.removeItem('userId');
   localStorage.removeItem('user_name');
   localStorage.removeItem('email');
   sessionStorage.clear();
    navigate('/login');
  };

  const handleNav = (path: string) => {
    navigate(path);
    setDrawerOpen(false); // Close drawer on navigation
  };


  const { data: notifications = [] } = useGetNotificationQuery(
  { user_id: userId || '' },
  { skip: !isLoggedIn || !userId, pollingInterval: 30000 } // auto refresh every 30s
);

const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;
 

 


  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-md   left-0 right-0 ">
        <div className="container mx-auto flex items-center h-16 px-4 md:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            className="md:hidden mr-4 p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

            <a href="/" style={{ textDecoration: 'none' ,color: ''}}  className="text-xl md:text-2xl  font-semibold flex-grow text-white hover:text-blue-200 transition-colors duration-200 no-underline">
            Yandanar Express
          </a>
       
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center ">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                to={item.path}
                style={{ textDecoration: 'none',color: isHovered ? 'green' : 'purple' }}
                 onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
     
                className={`text-white hover:text-blue-200 transition-colors flex items-center gap-1 relative 
                  ${location.pathname === item.path ? 'font-bold text-emerald-600' : ''}`}
              >
              
               {item.text} 
                {item.showBadge && unreadNotificationsCount > 0 && item.text === 'Notifications' && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                {/* Profile Button for logged-in users */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <User className="w-5 h-5" />
                    <span>{userName}</span>
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-2 py-2 rounded-md border border-white hover:bg-white hover:text-blue-600 transition-colors duration-200 font-medium text-base lg:text-lg no-underline"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className='text-red-500'>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="flex items-center space-x-2 px-1 py-2 rounded-md border border-white hover:bg-white hover:text-blue-600 transition-colors duration-200 font-medium text-base lg:text-lg no-underline"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </nav>
          <ChatBot/>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 xs:w-3/4 max-w-xs z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside drawer
        onKeyDown={(e) => {
          if (e.key === 'Escape') setDrawerOpen(false);
        }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="text-xl font-semibold text-blue-600">Menu</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.text}>
                <Link
                  to={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`block w-full text-left p-3 rounded hover:bg-gray-100 text-gray-800 transition-colors duration-200 items-center gap-2 relative no-underline
                    ${location.pathname === item.path ? 'font-bold text-blue-600' : ''}`}
                >
                
                  {item.text}
                  {item.showBadge && unreadNotificationsCount > 0 && item.text === 'Notifications' && (
                    <span className="absolute top-1 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <>
                {profileMenuItems.map((item) => (
                  <li key={item.text}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        handleNav(item.path);
                        setShowProfileModal(false); // Close modal if open
                      }}
                      className="flex items-center space-x-2 w-full text-left p-3 rounded hover:bg-gray-100 text-gray-800 transition-colors duration-200 no-underline"
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      <span>{item.text}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left p-3 rounded hover:bg-gray-100 text-gray-800 transition-colors duration-200 no-underline"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => handleNav('/login')}
                  className="flex items-center space-x-2 w-full text-left p-3 rounded hover:bg-gray-100 text-gray-800 transition-colors duration-200 no-underline"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span>Login</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Spacer for fixed header - essential */}
      <div className="h-0" />

      {/* Render Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            userName={userName}
            userEmail={userEmail}
            userRole={role}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default UserNavbar;
