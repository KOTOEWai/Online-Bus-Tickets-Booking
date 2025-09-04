import React from 'react';
import { motion} from 'framer-motion';
import { Info, MapPin, Phone, Mail, Clock } from 'lucide-react'; // Import MapPin for location icon

import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import MapComponent from '../components/MapComponent'; // Import the new MapComponent
import { containerVariants, itemVariants } from '../hooks/useAnimationVariants';

const AboutUsPage: React.FC = () => {
  // Replace with your actual company location (Latitude, Longitude)
  // Example for a location in Yangon, Myanmar21.96109, 96.11397
  const companyLocation: [number, number] = [21.96109, 96.11397]; // Lat, Lng for Yangon city center (approx)
  const companyAddress = "No. 123, 73rd Street, Between 28th & 29th Street, Chan Aye Tharzan Township, Mandalay, Myanmar";
  const companyName = "Yandanar Express Office";

 

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />

      <div className="container mx-auto flex-grow py-8 px-4 md:px-6 ">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 flex items-center justify-center gap-3">
          <Info className="w-8 h-8 text-blue-600 " /> About Yandanar Express
        </h1>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Company Information */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yandanar Express is dedicated to providing comfortable, safe, and reliable bus travel experiences across Myanmar.
              Since our establishment in 2020, we have been committed to connecting cities and communities,
              ensuring every journey is a pleasant one for our passengers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We pride ourselves on our modern fleet, professional drivers, and excellent customer service.
              Your journey is our priority, and we strive to make every trip memorable.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
              Contact Us
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>{companyAddress}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <span>+95 9 123 456 789</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>info@yandanarexpress.com</span>
              </p>
              <p className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Office Hours: Mon-Fri, 9:00 AM - 5:00 PM</span>
              </p>
            </div>
          </motion.div>

          {/* Right Column: Map Location */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col items-center justify-center"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-red-500" /> Find Our Office
            </h2>
            {/* Integrate the MapComponent here */}
            
            <MapComponent
              position={companyLocation}
              zoom={15} // Adjust zoom level as needed
              popupText={companyName}
            
            />
            <p className="text-center text-gray-600 text-sm mt-4">
              Click the marker on the map for more details.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
