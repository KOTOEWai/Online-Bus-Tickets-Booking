import React from 'react';
import { Link } from 'react-router-dom';
import { motion} from 'framer-motion';
import {   Globe  } from 'lucide-react'; // Lucide icons for visual flair

import UserNavbar from '../components/nav'; // Assuming UserNavbar is in '../components/nav'
import Footer from '../components/Footer';
import { containerVariants, cardItemVariants, pageTitleVariants } from '../hooks/useAnimationVariants';
import { popularDestinations } from '../constants/locations';


const DestinationsPage: React.FC = () => {
 


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />

      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={pageTitleVariants}
        >
          <Globe className="w-10 h-10 mr-4 text-blue-600" /> Discover Our Destinations
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12"
          initial="hidden"
          animate="visible"
          variants={pageTitleVariants} // Reusing for description with slightly adjusted delay
         
        >
          Embark on an unforgettable journey with Yandanar Express. Explore the beauty and culture of Myanmar through our popular bus routes.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
              {popularDestinations.map((destination) => (
         <motion.div variants={cardItemVariants} className=""  >
        <div key={destination.id} className="w-full flex flex-col">
            <img src={destination.image} alt={destination.name} className="object-cover object-center w-full h-48" />
            <div className="flex flex-grow">
                <div className="triangle"></div>
                <div className="flex flex-col justify-between px-4 py-6 bg-white border border-gray-400 text">
                    <div>
                        <p 
                            className="block mb-4 text-2xl font-semibold leading-tight hover:underline hover:text-blue-600">
                           {destination.name}
                        </p>
                        <p className="mb-4">
                            {destination.description}
                        </p>
                    </div>
                    <div>
                        <Link  to={`/destinationDetail/${destination.id}`}
                            className="inline-block pb-1 mt-2 text-base font-black text-blue-600 uppercase border-b border-transparent hover:border-blue-600">Read
                            More -&gt;</Link>
                    </div>
                </div>
            </div>
        </div>
           </motion.div>
      
      ))}
        </motion.div>
      </div>
         
      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default DestinationsPage;
