// seatSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Seat {
  id: number;
  number: string;
}

interface SeatState {
  selectedSeats: Seat[];
  passengerCount: number; // passenger count လည်း Redux ထဲ ထည့်နိုင်တယ်
}

const initialState: SeatState = {
  selectedSeats: [],
  passengerCount: 0,
};

const seatSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    setPassengerCount: (state, action: PayloadAction<number>) => {
      state.passengerCount = action.payload;
    },
    toggleSeat: (state, action: PayloadAction<Seat>) => {
      const exists = state.selectedSeats.find((s) => s.id === action.payload.id);

      if (exists) {
        // deselect
        state.selectedSeats = state.selectedSeats.filter(
          (s) => s.id !== action.payload.id
        );
      } else {
        if (state.selectedSeats.length < state.passengerCount) {
          state.selectedSeats.push(action.payload);
        } else {
          alert(`You can only select up to ${state.passengerCount} seat(s).`);
        }
      }
    },
    clearSeats: (state) => {
      state.selectedSeats = [];
    },
  },
});

export const { setPassengerCount, toggleSeat, clearSeats } = seatSlice.actions;
export default seatSlice.reducer;
