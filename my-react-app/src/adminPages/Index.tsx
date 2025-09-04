/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminSidebar from "../components/adminNav"
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import  {   useMemo } from 'react';
import { pageTitleVariants, sectionVariants } from "../hooks/useAnimationVariants";

import {
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useGetSalesReportMutation
} from "../service/adminSlice";
import IndexTable from "./UI/IndexTable";

import SaleReportTable from "./UI/SaleReportTable";
import DateRange from "./UI/DateRage";
import SummaryCard from "./UI/SummaryCard";
import Graph from "./UI/Graph";
import { FileText, Loader2 } from "lucide-react";





export default function Admin() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ RTK Query Hooks
const { data: bookings = [], refetch: refetchBookings } = useGetBookingsQuery();
const [deleteBooking] = useDeleteBookingMutation();
const [getSalesReport, { data: salesData = [], isLoading, error }] =
  useGetSalesReportMutation();


  // Default 30 days date range
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
  }, []);

  // Fetch sales when date changes
  useEffect(() => {
    if (startDate && endDate) {
      getSalesReport({ startDate, endDate });
    }
  }, [startDate, endDate, getSalesReport]);

  // ✅ Summary stats
  const totalRevenue = salesData.reduce(
    (sum: number, r: { total_amount: string; }) => sum + parseInt(r.total_amount),
    0
  );
  const totalTicketsSold = salesData.reduce((sum: any, r: { num_seats: any; }) => sum + r.num_seats, 0);
  const totalBookings = salesData.length;

  // ✅ Chart data
  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    salesData.forEach((rec: { booking_date: string; total_amount: string; }) => {
      const date = rec.booking_date.split(" ")[0];
      const current = map.get(date) || 0;
      map.set(date, current + parseInt(rec.total_amount));
    });
    return Array.from(map.keys())
      .sort()
      .map((d) => ({ date: d, revenue: map.get(d) }));
  }, [salesData]);

  // ✅ Delete booking
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    await deleteBooking(id).unwrap();
    refetchBookings();
    getSalesReport({ startDate, endDate });
  };

  // ✅ Download CSV
  const handleDownloadReport = () => {
    if (salesData.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = [
      "Booking ID",
      "Bus Number",
      "Bus Type",
      "Start Location",
      "End Location",
      "Departure Time",
      "Total Amount",
      "Seats",
      "Booking Status",
      "Booking Date",
    ];
    const rows = salesData.map((r: { booking_id: any; bus_number: any; bus_type: any; start_location: any; end_location: any; departure_time: string | number | Date; total_amount: any; num_seats: any; booking_status: any; booking_date: any; }) => [
      r.booking_id,
      r.bus_number,
      r.bus_type,
      r.start_location,
      r.end_location,
      new Date(r.departure_time).toLocaleString(),
      r.total_amount,
      r.num_seats,
      r.booking_status,
      r.booking_date,
    ]);
    const csvContent = [headers, ...rows]
      .map((e) =>
        e.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales_report_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
            <AdminSidebar>
      <h2>📊 Dashboard Overview</h2>
      <p>Welcome, Admin! Here’s your summary.</p>
       <div className="container mt-5">
      <h4>Recent Bookings</h4>
    
      <IndexTable bookings={bookings} handleDelete={handleDelete} />

    
      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        {/* Page Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={pageTitleVariants}
        >
          <FileText className="w-10 h-10 mr-4 text-blue-600" /> Sales Report
        </motion.h1>

        

        {/* Date Range Filter and Action Buttons */}
         <DateRange
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        getSalesReport={getSalesReport}
        handleDownloadReport={handleDownloadReport}
        isLoading={isLoading}
        salesData={salesData}
      />
        {/* Summary Cards */}
       <SummaryCard 
       totalRevenue={totalRevenue}
       totalTicketsSold={totalTicketsSold}
       totalBookings={totalBookings}/>

        {/* Sales Trend Line Graph */}
        <Graph isLoading={false} error={null} chartData={chartData} />


        {/* Sales Data Table */}
        <motion.section
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-gray-700" /> Detailed Sales Records
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="mt-4 text-lg text-gray-600">Loading sales data...</p>
            </div>
          ) : error ? (
             <div className="text-red-600">
             {(error as any)?.data?.message || "Failed to load data"}
             </div>
          ) : salesData.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md text-center">
              <strong className="font-bold">No Sales Data Found</strong> for the selected date range.
            </div>
          ) : (
            <div className="overflow-x-auto">
             <SaleReportTable salesData={salesData}/>
            </div>
          )}
        </motion.section>
      </div>

    </div>
        </AdminSidebar>

  )
}


