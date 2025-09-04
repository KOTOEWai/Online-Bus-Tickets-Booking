

import { motion} from 'framer-motion';
import {
  Ticket,  ShieldCheck, Headset, MapPin, Clock, Users,
  
} from 'lucide-react'; // Lucide React Icons

import UserNavbar from '../components/nav'; // Import your custom Navbar component
import Footer from '../components/Footer';
import Routes from '../components/RoutMap'
import { sectionTitleVariants, cardStaggerVariants, cardItemVariants } from '../hooks/useAnimationVariants';
// ServicesPage Component (defined here for self-containment)
const ServicesPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />
     <Routes/>
      {/* Services Overview Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionTitleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From easy booking to reliable support, we ensure your travel experience is smooth and enjoyable.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardStaggerVariants}
        >
          {/* Service Card 1: Easy Booking */}
          <motion.div variants={cardItemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full inline-flex items-center justify-center">
                <Ticket className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Effortless Booking</h3>
              <p className="text-gray-600 flex-grow">
                Our intuitive platform allows you to find and book bus tickets in just a few clicks.
              </p>
            </div>
          </motion.div>

          {/* Service Card 2: Secure Payments */}
          <motion.div variants={cardItemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div className="mx-auto mb-6 p-4 bg-green-100 rounded-full inline-flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Transactions</h3>
              <p className="text-gray-600 flex-grow">
                Your payments are protected with state-of-the-art encryption technology.
              </p>
            </div>
          </motion.div>

          {/* Service Card 3: 24/7 Support */}
          <motion.div variants={cardItemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div className="mx-auto mb-6 p-4 bg-purple-100 rounded-full inline-flex items-center justify-center">
                <Headset className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-gray-600 flex-grow">
                Our customer service team is available 24/7 to assist you with any queries.
              </p>
            </div>
          </motion.div>

          {/* Service Card 4: Wide Network */}
          <motion.div variants={cardItemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div className="mx-auto mb-6 p-4 bg-orange-100 rounded-full inline-flex items-center justify-center">
                <MapPin className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Extensive Route Network</h3>
              <p className="text-gray-600 flex-grow">
                Access a vast selection of routes covering all major destinations.
              </p>
            </div>
          </motion.div>

          {/* Service Card 5: Real-time Updates */}
          <motion.div variants={cardItemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div className="mx-auto mb-6 p-4 bg-red-100 rounded-full inline-flex items-center justify-center">
                <Clock className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600 flex-grow">
                Stay informed with live updates on bus schedules and arrivals.
              </p>
            </div>
          </motion.div>

          {/* Service Card 6: Group Booking */}
          <motion.div variants={cardItemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div className="mx-auto mb-6 p-4 bg-yellow-100 rounded-full inline-flex items-center justify-center">
                <Users className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Group & Corporate Travel</h3>
              <p className="text-gray-600 flex-grow">
                Special arrangements and discounts for group and corporate bookings.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6 md:px-12 bg-blue-600 text-white text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionTitleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Seamless Travel?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover the convenience and comfort of booking your next bus journey with us.
          </p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
          >
            Start Your Journey
          </a>
        </motion.div>
      </section>

      {/* Footer */}
     <Footer/>
    </div>
  );
};


export default ServicesPage
