import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeMenu: 'home' // default value
  },
  reducers: {
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    }
  }
});

export const { setActiveMenu } = uiSlice.actions;
export default uiSlice.reducer;