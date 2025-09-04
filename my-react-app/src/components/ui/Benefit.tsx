import { motion  } from "framer-motion";
import Bus from "../../../public/HomePhoto.png";
import Girl from "../../../public/HomePhoto1.png";
import { fadeInUp } from "../../hooks/useAnimationVariants";

function Benefit() {
 

  return (
    <div className="px-4">
      {/* Section 1 */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center text-center md:text-left p-6 md:p-10 max-w-6xl mx-auto mt-10 gap-6 border-b border-gray-200"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.img
          src={Bus}
          alt="Beautiful Bus"
          className="w-full max-w-sm md:max-w-md rounded-lg shadow-md"
          variants={fadeInUp}
        />
        <motion.div
          className="flex flex-col items-center md:items-start justify-center gap-4"
          variants={fadeInUp}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Travelling by Bus in Myanmar
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-lg">
            Looking for an online booking portal to book bus tickets to travel in Myanmar? 
            You have come to the right place! Myanmar is a big country and planning a travel 
            itinerary can be tough considering how much Myanmar has to offer. Myanmar travel 
            gives you a variety of beaches, highlands, nature, temples, wilderness and tranquility.
          </p>
        </motion.div>
      </motion.div>

      {/* Section 2 */}
      <motion.div
        className="flex flex-col-reverse md:flex-row items-center justify-center text-center md:text-left p-6 md:p-10 max-w-6xl mx-auto mt-10 gap-6 border-b border-gray-200"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="flex flex-col items-center md:items-start justify-center gap-4"
          variants={fadeInUp}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Benefits of Online Booking vs. Buying at the Counter
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-lg">
            One of the ultimate benefits when you book bus or ferry tickets online is you can 
            book in advance from anywhere and anytime. This is especially useful for tourists 
            and those who find it difficult to access the bus terminal, train station, or ferry 
            ticket counter. Instead, you save the cost and time going to stations to buy tickets.
          </p>
        </motion.div>
        <motion.img
          src={Girl}
          alt="Happy traveler"
          className="w-full max-w-sm md:max-w-md rounded-lg shadow-md"
          variants={fadeInUp}
        />
      </motion.div>
    </div>
  );
}

export default Benefit;
