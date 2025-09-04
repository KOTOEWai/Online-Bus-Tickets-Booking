import React from 'react';
import { motion } from 'framer-motion';
import { Hourglass, CheckCircle, XCircle } from 'lucide-react'; // Ensure these are imported
import { hourglassSpinVariants } from '../hooks/useAnimationVariants';

// Assuming 'ticket' is an object with 'payment_status' property
// This is a standalone snippet, integrate it into your existing component where tickets are rendered.

const TicketStatusDisplay: React.FC<{ payment_status: 'pending' | 'approved' | 'rejected' }> = ({ payment_status }) => {

  return (
    <div className="p-6 pt-0 border-t border-gray-100 mt-auto">
      {payment_status === 'approved' ? (
        <div className="flex items-center text-green-600 font-bold text-lg">
          <CheckCircle className="w-6 h-6 mr-2" /> Payment Approved. Thanks!
        </div>
      ) : payment_status === 'rejected' ? (
        <div className="flex items-center text-red-600 font-bold text-lg">
          <XCircle className="w-6 h-6 mr-2" /> Your payment was rejected.
        </div>
      ) : (
        // This is the section with the animation
        <div className="flex items-center text-orange-600 font-bold text-lg">
          <motion.div
            variants={hourglassSpinVariants}
            animate="animate"
            className="flex items-center justify-center mr-2" // Added flex for centering if needed
          >
            <Hourglass className="w-6 h-6" />
          </motion.div>
          Waiting for payment approval
        </div>
      )}
      {/* You can add the rejected message here if needed, or keep it in your main component */}
      {/* {ticket.payment_status === 'rejected' && (
        <p className="text-red-500 text-sm mt-1">This booking will be removed soon.</p>
      )} */}
    </div>
  );
};

export default TicketStatusDisplay; // Exported as a component for demonstration
