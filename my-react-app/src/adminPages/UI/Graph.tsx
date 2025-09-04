/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { LineChartIcon, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  LineChart,
} from "recharts";
import { sectionVariants } from "../../hooks/useAnimationVariants";
import type { GraphProps } from "../../interfaces/types";


function Graph({ isLoading, error, chartData }: GraphProps) {
  return (
    <motion.section
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <LineChartIcon className="w-6 h-6 text-gray-700" /> Daily Revenue Trend
      </h2>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-600">Loading chart data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
          <strong className="font-bold">Error:</strong>{" "}
          {(error as any)?.data?.message || "Failed to load data"}
        </div>
      ) : chartData.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md text-center">
          <strong className="font-bold">No Chart Data Available</strong> for
          the selected date range.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()} MMK`,
                "Revenue",
              ]}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6" // Tailwind Blue-600
              activeDot={{ r: 8 }}
              strokeWidth={2}
              name="Total Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </motion.section>
  );
}

export default Graph;
