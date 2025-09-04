import { motion } from "framer-motion";
import { sectionVariants } from "../../hooks/useAnimationVariants";
import { CalendarDays, Filter, Download } from "lucide-react";
import type { DateRangeProps } from "../../interfaces/types";

function DateRange({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  getSalesReport,
  handleDownloadReport,
  isLoading,
  salesData,
}: DateRangeProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      {/* Start Date Input */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <CalendarDays className="w-6 h-6 text-gray-600" />
        <label htmlFor="startDate" className="font-medium text-gray-700">
          From:
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* End Date Input */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <label htmlFor="endDate" className="font-medium text-gray-700">
          To:
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={() => getSalesReport({ startDate, endDate })}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
        disabled={isLoading || !startDate || !endDate}
      >
        <Filter className="w-5 h-5" /> Filter Report
      </button>

      {/* Download CSV Button */}
      <button
        onClick={handleDownloadReport}
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
        disabled={isLoading || salesData.length === 0}
      >
        <Download className="w-5 h-5" /> Download CSV
      </button>
    </motion.div>
  );
}

export default DateRange;
