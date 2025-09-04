import { motion } from "framer-motion";
import { sectionTitleVariants } from "../../hooks/useAnimationVariants";

export default function CallAction() {
  return (
     <section className="py-16 px-6 md:px-12 bg-blue-600 text-white text-center">
      
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={sectionTitleVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Book your next bus journey today and experience comfortable and affordable travel.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300">
              Book Your Ticket Now
            </button>
          </motion.div>
        </section>
  )
}
