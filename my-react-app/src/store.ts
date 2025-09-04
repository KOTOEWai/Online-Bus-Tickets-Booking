// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { busApi } from '../src/service/apiSlice'; // ဖန်တီးထားတဲ့ busApi ကို import လုပ်
import notificationReducer from '../src/service/notificationSlice'; // notificationSlice ကို import လုပ်
import seatReducer from '../src/service/seatSlice'
import { adminApi } from './service/adminSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer, // notificationSlice ရဲ့ reducer ကို store ထဲ ထည့်သွင်းခြင်း
    [busApi.reducerPath]: busApi.reducer, // busApi ရဲ့ reducer ကို store ထဲ ထည့်သွင်းခြင်း
    seat: seatReducer,
    [adminApi.reducerPath]: adminApi.reducer,
   
  },
  // API caching, invalidation, polling စတာတွေအတွက် middleware ကို ထည့်သွင်းပေးရမယ်
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(busApi.middleware).concat(adminApi.middleware),
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
