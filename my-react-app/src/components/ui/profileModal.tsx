import { X, UserCircle, User, Mail, User2, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

// --- ProfileModal Component ---
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string; // Placeholder for user name
  userEmail: string; // Placeholder for user email
  userRole: string | null; // Placeholder for user role
  onLogout: () => void; // Add onLogout prop
}
export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userName, userEmail, userRole, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close profile modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <UserCircle className="w-20 h-20 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h3>
          <Link to={'/profileDetail'} className="text-gray-600" onClick={onClose}>View your account details.</Link>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-3 text-blue-500" />
            <span className="font-semibold">Name:</span> <span className="ml-2">{userName || 'Guest User'}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-blue-500" />
            <span className="font-semibold">Email:</span> <span className="ml-2">{userEmail || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <User2 className="w-5 h-5 mr-3 text-blue-500" />
            <span className="font-semibold">Role:</span> <span className="ml-2 capitalize">{userRole || 'Guest'}</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-end">
            <button
              onClick={onLogout} // Use the onLogout prop here
              className="flex items-center space-x-2 px-4 py-2 rounded-md border border-white hover:bg-white hover:text-blue-600 transition-colors duration-200 font-medium text-base lg:text-lg"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className='text-red-500'>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};