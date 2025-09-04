// features/notificationSlice.ts
import { createSlice, type PayloadAction} from '@reduxjs/toolkit';

interface NotificationState {
  message: string | null;
  type: 'success' | 'error' | null;
}

const initialState: NotificationState = {
  message: null,
  type: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<NotificationState>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearNotification: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

