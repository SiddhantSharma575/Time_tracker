import { GlobalTimer } from "@/src/types/global-timer";
import { createSlice } from "@reduxjs/toolkit";

const initialState: GlobalTimer = {
  isRunning: false,
  currentTime: 0,
  currentSelectedProjected: 0,
};

export const globalTimerSlice = createSlice({
  name: "globalTimer",
  initialState,
  reducers: {
    setTimer: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setTimer } = globalTimerSlice.actions;

export default globalTimerSlice.reducer;
