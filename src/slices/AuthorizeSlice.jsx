import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ulid } from "ulid";

// Helper functions
const getStoredUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

const storeUser = (user) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

// Registration thunk
export const registration = createAsyncThunk(
  'auth/registration',
  async (userData, { rejectWithValue }) => {
    try {
      const users = getStoredUsers();
      
      if (users.some(user => user.username === userData.username)) {
        return rejectWithValue('Username already exists');
      }

      const newUser = {
        id: ulid(),
        username: userData.username,
        password: userData.password
      };

      storeUser(newUser);
      return { id: newUser.id, username: newUser.username };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const users = getStoredUsers();
      const user = users.find(user => 
        user.username === credentials.username && 
        user.password === credentials.password
      );

      if (!user) {
        return rejectWithValue('Invalid username or password');
      }

      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username
      }));

      return { id: user.id, username: user.username };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout action
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('currentUser');
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('currentUser')) || null,
    isLoggedIn: !!localStorage.getItem('currentUser'),
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(registration.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
      });
  }
});

export default authSlice.reducer;