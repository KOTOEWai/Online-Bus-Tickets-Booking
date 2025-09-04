
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BusDetails, Notification, ContactFormData, 
  DestinationDetail, ReviewFormData,
   SearchPayload, Tickets,
   BookingInfo,
   } from '../interfaces/types';
import type { Reviews } from '../interfaces/types';
import type { UserInfo } from '../interfaces/types';



export const busApi = createApi({
   reducerPath: 'api', // Redux store ထဲမှာ ဒီ service ရဲ့ state ကို သိမ်းမယ့်နာမည်
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`, // သင့် backend API ရဲ့ base URL
    credentials: 'include', // CORS request တွေမှာ credentials (cookies, authorization headers, TLS client certificates) တွေပါဝင်စေမယ်
  }),
   tagTypes: ['Buses','Destination','Review','UserInfo'], // Optional: data revalidation အတွက် tag သတ်မှတ်နိုင်သည်
  endpoints: (builder) => ({
    // searchBuses query: POST method ဖြင့် bus data များကို ရှာဖွေရန်
    searchBuses: builder.query<BusDetails[], SearchPayload>({
      query: (payload) => ({
        url: 'searchBus.php', // API endpoint
        method: 'POST', // HTTP method
        body: payload, // Request body
        provideTags: ['Buses'], // Optional: ဒီ query က data ကို ဘယ် tag နဲ့ ပတ်သက်သလဲ ဆိုတာ သတ်မှတ်ခြင်း
      }),
      // keepUnusedDataFor: 60, // Optional: data ကို ဘယ်လောက်ကြာကြာ cache ထဲမှာ ထားမလဲ (seconds)
    }),
    destination: builder.query< DestinationDetail,string   >({
      query: (id) => (
        {
          url: `getDestinationDetails.php?id=${id}`,
          method: 'GET',
          provideTags: ['Destination'],
        }
      )
    }),
    review:builder.query<Reviews[],void>({
      query: () => (
        {
          url: 'getReviews.php',
          method: 'GET',
          provideTags: ['Review'],
        }
      )
     }),
    submitReview: builder.mutation<any, ReviewFormData & { user_id: string }>({
      query: (newReview) => ({
        url: 'submitReview.php',
        method: 'POST',
        body: newReview,
        invalidatesTags: ['Review'], // ဒီ mutation က data ကို ဘယ် tag နဲ့ ပတ်သက်သလဲ ဆိုတာ သတ်မှတ်ခြင်း
      }),
    }), 
    contact: builder.mutation<any,ContactFormData>({
      query: (formData) => ({
        url: 'contact/create.php',
        method: 'POST',
        body: formData,
      }),
    }),
   getNotification: builder.query<Notification[], { user_id: string }>({
  query: ({ user_id }) => ({
    url: `getUserNotifications.php?user_id=${user_id}`,
    method: 'GET',
    ProviderdTags: ['Notification']
  }),
     }),
    markNotificationAsRead: builder.mutation<any, { notification_id: number; user_id: string }>({
      query: ({ notification_id, user_id }) => ({
        url: 'markNotificationAsRead.php',
        method: 'POST',
        body: { notification_id, user_id },
      }),
    }),
    getMyticket: builder.query<Tickets[],void>({
      query: () => ({
        url: 'getMytickets.php',
        transformResponse: (response: { tickets: Tickets[] }) => response.tickets,
        method: 'GET',
      }),
    }),
    getUserProfile: builder.query<UserInfo,string >({
      query: (userId ) => ({
        url: `getUserInfo.php?user_id=${userId}`,
        method: 'GET',
        providerTags: ['UserInfo']}),
    }),
   updateUserProfile: builder.mutation< { success: boolean; message: string }, { user_id: string; name: string; email: string }  >({
      query: (body) => ({
        url: 'editProfile.php',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }),
    }),
     changePassword: builder.mutation<any, { user_id: string; current_password: string; new_password: string }>({
      query: (body) => ({
        url: '/changePassword.php',
        method: 'POST',
        body,
      }),
    }),
    getScheduleSeats:builder.query<any,{id:string}>({
      query:({id})=>({
        url:`getSchSeats.php?schedule_id=${id}`,
        method:'GET',
      }),
    }),
    bookSeats: builder.mutation<any, { id: string; selected_seats: number[] }>({
      query: (body) => ({
        url: 'bookSeats.php',
        method: 'POST',
        body,
      }),
    }),
    getBookingInfo: builder.query<BookingInfo, string>({
      query: (bookingId) => `getBookinginfo.php?booking_id=${bookingId}`,
      transformResponse: (response: any) => {
        // ✅ normalize server response
        if (response && !response.error) {
          return {
            ...response,
            price: parseFloat(response.price),
            total_amount: parseFloat(response.total_amount),
            seats:
              typeof response.seats === "string"
                ? response.seats.split(",").map((s: string) => s.trim())
                : response.seats || [],
          } as BookingInfo;
        }
        throw new Error(response.error || "Failed to fetch booking info");
      },
    }),
    saveTravellerInfo: builder.mutation<{ success: boolean; error?: string },any>({
      query: (formData) => ({
        url: "travelinfo.php",
        method: "POST",
        body: formData,
      }),
    }),
  }),
  
});

// RTK Query ကနေ auto-generate လုပ်ပေးတဲ့ hook ကို export လုပ်ခြင်း
export const { 
  useSearchBusesQuery,
  useDestinationQuery, 
  useReviewQuery,
  useSubmitReviewMutation,
  useContactMutation,
  useGetNotificationQuery,
  useMarkNotificationAsReadMutation,
  useGetMyticketQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetScheduleSeatsQuery,
  useBookSeatsMutation,
  useGetBookingInfoQuery,
  useSaveTravellerInfoMutation
 } = busApi;