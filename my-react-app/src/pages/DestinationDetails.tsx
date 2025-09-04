
import { useParams,  } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Info,  Globe, Bus, Loader2, AlertCircle, Star } from 'lucide-react';

import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import MapComponent from '../components/MapComponent'; // Reusing your MapComponent
import { containerVariants, itemVariants } from '../hooks/useAnimationVariants';

import { useDestinationQuery } from '../service/apiSlice';





const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get destination ID from URL

   const { data: destination , isLoading, isError } = useDestinationQuery(id || '', { skip: !id });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
        <UserNavbar />
        <div className="flex-grow flex items-center justify-center py-8">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
          <p className="text-gray-600 ml-3">Loading destination details...</p>
        </div>
        <Footer />
      </div>
    );
  }


   if (!destination) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
        <UserNavbar />
        <div className="flex-grow flex items-center justify-center py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md text-center">
            <AlertCircle className="inline-block w-5 h-5 mr-2" />
            <p className="font-semibold">Destination not found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
        <UserNavbar />
        <div className="flex-grow flex items-center justify-center py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
            <AlertCircle className="inline-block w-5 h-5 mr-2" />
            <strong className="font-bold">Error:</strong> {isError}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

 

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />

      <div className="container mx-auto flex-grow py-8 px-4 md:px-6">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Destination Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Globe className="w-10 h-10 text-green-600" /> {destination.name}
            </h1>
            <p className="text-gray-600 text-lg">{destination.description}</p>
          </motion.div>

          {/* Image */}
          <motion.div className="mb-8 relative" variants={itemVariants}>
            <img
              src={destination.image_url}
              alt={destination.name}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null; // Prevent looping
                e.currentTarget.src = 'https://placehold.co/800x500/cccccc/333333?text=Image+Not+Found'; // Fallback
              }}
            />
         
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Details Section */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-600" /> About {destination.name}
              </h2>
              <p className="text-gray-700 leading-relaxed">{destination.description}</p>

              {destination.popular_attractions && destination.popular_attractions.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Popular Attractions
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {destination.popular_attractions.map((attraction, index) => (
                      <li key={index}>{attraction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Map Section */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-500" /> Location on Map
              </h2>
              {destination.latitude && destination.longitude ? (
                <MapComponent
                  position={[destination.latitude, destination.longitude]}
                  zoom={13} // Adjust zoom as needed
                  popupText={`${destination.name} Office`}
                />
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-gray-600 text-center">
                  Map coordinates not available for this destination.
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Routes Section */}
          {destination.related_routes && destination.related_routes.length > 0 && (
            <motion.div className="mt-12 pt-8 border-t border-gray-200" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bus className="w-6 h-6 text-purple-600" /> Routes To/From {destination.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.related_routes.map((route, index) => (
                  <div key={index} className="bg-purple-50 p-4 rounded-lg shadow-sm flex items-center justify-between">
                    <p className="text-purple-800 font-medium">
                      {route.start} &rarr; {route.end}
                    </p>
                    <span className="text-purple-700 font-bold">
                      {route.price.toLocaleString()} MMK
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 text-sm mt-4">
                (This is illustrative data. Actual routes and prices may vary.)
              </p>
            </motion.div>
          )}

        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetailPage;
