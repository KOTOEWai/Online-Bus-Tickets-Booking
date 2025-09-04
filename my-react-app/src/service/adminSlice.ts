// services/adminApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Booking, SalesRecord } from "../interfaces/types";


export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: "include", // optional if you need cookies
  }),
  tagTypes: ["Bookings", "Sales"],
  endpoints: (builder) => ({
    // ✅ Get Bookings
    getBookings: builder.query<Booking[], void>({
      query: () => "admin/bookings/read.php",
      providesTags: ["Bookings"],
    }),

    // ✅ Delete Booking
    deleteBooking: builder.mutation<{ status: string; message: string }, number>({
      query: (booking_id) => ({
        url: "admin/bookings/delete.php",
        method: "POST",
        body: { booking_id },
      }),
      invalidatesTags: ["Bookings", "Sales"],
    }),

    // ✅ Sales Report (POST)
    getSalesReport: builder.mutation<
      SalesRecord[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: "getSalesReport.php",
        method: "POST",
        body: { startDate, endDate },
      }),
      // only return approved records
      transformResponse: (response: SalesRecord[]) =>
        response.filter((rec) => rec.booking_status === "approved"),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useGetSalesReportMutation,
} = adminApi;
