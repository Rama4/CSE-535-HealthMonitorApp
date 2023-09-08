import {configureStore} from '@reduxjs/toolkit';
import {appSlice} from '../slices';

export const store = configureStore({
  reducer: {
    userData: appSlice,
  },
});
