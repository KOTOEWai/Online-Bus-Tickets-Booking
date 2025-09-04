import  { motion } from "framer-motion"
import { DollarSign, Users, FileText } from "lucide-react"
import { sectionVariants, cardItemVariants } from "../../hooks/useAnimationVariants"
import type { SummaryCardProps } from "../../interfaces/types"

function SummaryCard({
    totalRevenue,
    totalTicketsSold,
    totalBookings
}:SummaryCardProps) {
  return (
    <motion.div
             className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
             variants={sectionVariants}
           >
             {/* Total Revenue Card */}
             <motion.div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between" variants={cardItemVariants}>
               <div>
                 <p className="text-gray-600 text-lg">Total Revenue</p>
                 <h3 className="text-3xl font-bold text-green-700 mt-1">
                   <DollarSign className="inline-block w-8 h-8 mr-2" /> {totalRevenue.toLocaleString()} MMK
                 </h3>
               </div>
             </motion.div>
             {/* Total Tickets Sold Card */}
             <motion.div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between" variants={cardItemVariants}>
               <div>
                 <p className="text-gray-600 text-lg">Total Tickets Sold</p>
                 <h3 className="text-3xl font-bold text-blue-700 mt-1">
                   <Users className="inline-block w-8 h-8 mr-2" /> {totalTicketsSold.toLocaleString()}
                 </h3>
               </div>
             </motion.div>
             {/* Total Bookings Card */}
             <motion.div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between" variants={cardItemVariants}>
               <div>
                 <p className="text-gray-600 text-lg">Total Bookings</p>
                 <h3 className="text-3xl font-bold text-purple-700 mt-1">
                   <FileText className="inline-block w-8 h-8 mr-2" /> {totalBookings.toLocaleString()}
                 </h3>
               </div>
             </motion.div>
           </motion.div>
  )
}

export default SummaryCard