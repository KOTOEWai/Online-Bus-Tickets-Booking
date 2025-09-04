

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,  Settings, Key,
  Loader2, AlertCircle, CalendarDays, Clock,
  Ticket, 
 
} from 'lucide-react';

import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import TicketStatusDisplay from '../components/WaitingForPayment';
import busTicketNotFound from '../../public/ticketNotFound.webp'; // Import the not found image
import { containerVariants, itemVariants } from '../hooks/useAnimationVariants';

import { useGetUserProfileQuery , useGetMyticketQuery } from '../service/apiSlice';


const UserProfilePage: React.FC = () => {

 
   const { data:tickets = [], error:ticketsError, isLoading : loading } = useGetMyticketQuery();
   const userId = localStorage.getItem('userId' ) || '';
   const { data:userInfo, error: userError } = useGetUserProfileQuery(userId );

 
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />
 <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mt-3">My Profile</h1>
      <div className="container mx-auto flex-grow py-8 px-4 md:px-6">
       
  {
    ticketsError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center mb-6">
        <AlertCircle className="inline-block w-5 h-5 mr-2" />
        <strong className="font-bold">Error:</strong> {ticketsError.toString()}
        <p className="mt-2 text-sm">Failed to load tickets. Please try again later.</p>
      </div>
    )
  }
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading your profile and tickets...</p>
          </div>
        ) : userError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
            <AlertCircle className="inline-block w-5 h-5 mr-2" />
            <strong className="font-bold">Error:</strong> {userError.toString()}
            <p className="mt-2 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column: User Information & Account Settings */}
            <div className="lg:col-span-1 space-y-8">
              {/* Personal Information Card */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" /> Personal Information
                </h2>
                {userInfo ? (
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center">
                      <span className="font-semibold w-24">Name:</span> <span>{userInfo.full_name}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold w-24">Email:</span> <span>{userInfo.email}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold w-24">Phone:</span> <span>{userInfo.phone}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold w-24">Role:</span> <span className="capitalize">{userInfo.role}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">User information not available.</p>
                )}
              </motion.div>
              

              {/* Account Settings / Other Functions Card */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-600" /> Account Settings
                </h2>
                <div className="space-y-3">
                  <Link
                    to="/edit-profile" // Placeholder path
                    className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors"
                  >
                    <User className="w-5 h-5" /> Edit Profile
                  </Link>
                  <Link
                    to="/change-password" // Placeholder path
                    className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors"
                  >
                    <Key className="w-5 h-5" /> Change Password
                  </Link>
                  {/* Add more user functions here */}
                </div>
              </motion.div>
            </div>

            {/* Right Column: My Booked Tickets */}
            <motion.div
              className="lg:col-span-2  rounded-xl shadow-lg p-6 md:p-8 "
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Ticket className="w-6 h-6 text-green-600" /> My Booked Tickets
              </h2>
             
        <div className="scroll-auto overflow-y-scroll h-[590px]"> {/* Replaced Container with a div with max-width and margin auto */}
        

          {loading ? (
            <div className="flex justify-center mt-12"> {/* Replaced Box and CircularProgress */}
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : tickets.length === 0 ? (
             <div className="flex flex-col justify-center items-center mt-12">
              <p className="text-center text-xl text-gray-600 mt-12">No tickets found!</p> 
              <img src={busTicketNotFound} alt="No Tickets" className='w-52' />
            
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6  p-4 rounded-lg scroll"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.booking_id}
                  variants={itemVariants} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    {/* Bus Info */}
                    <h3 className="text-2xl font-bold text-blue-700 mb-3 flex items-center">
                       {ticket.bus_number} ({ticket.bus_type})
                    </h3>
                    <p className="text-gray-700 text-lg mb-2">
                      <span className="font-semibold">{ticket.start_location}</span> &rarr; <span className="font-semibold">{ticket.end_location}</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-1 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" /> Departure: {new Date(ticket.departure_time).toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2 text-gray-500" /> Booking Date: {new Date(ticket.booking_date).toLocaleDateString()}
                    </p>
                    <p className="text-xl font-bold text-green-600">Total Amount: {ticket.total_amount} Ks</p>
                  </div>

                  {/* Payment Status */}
                  <TicketStatusDisplay payment_status={ticket.payment_status}/>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
    
            </motion.div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
