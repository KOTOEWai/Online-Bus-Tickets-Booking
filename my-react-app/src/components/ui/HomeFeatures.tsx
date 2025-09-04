import { motion } from "framer-motion";
import { cardItemVariants, cardStaggerVariants, sectionTitleVariants } from "../../hooks/useAnimationVariants";
import { BusFront, ShieldCheck, Headset } from "lucide-react";


export default function HomeFeatures() {
  return (
        <section className="py-16 px-6 md:px-12 border-b  ">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={sectionTitleVariants}
          >
            <h2 className="text-4xl md:text-4xl font-extrabold  text-gray-900 mb-4" style={{fontSize:"2.7rem"}}>Why Choose Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer the best bus booking experience with unparalleled convenience and reliability.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={cardStaggerVariants}
          >
            <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full inline-flex items-center justify-center">
                  <BusFront className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Easy Booking</h3>
                <p className="text-gray-600">
                  Book your tickets in a few simple steps, saving you time and hassle.
                </p>
              </div>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="mx-auto mb-6 p-4 bg-green-100 rounded-full inline-flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  All transactions are secured with the latest encryption technology.
                </p>
              </div>
            </motion.div>

            <motion.div variants={cardItemVariants}>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="mx-auto mb-6 p-4 bg-purple-100 rounded-full inline-flex items-center justify-center">
                  <Headset className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Our dedicated support team is always here to assist you.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

       
   
  )
}
