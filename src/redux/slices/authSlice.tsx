import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Define types
interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  loggedIn: boolean;
}

// Define input types
interface AuthCredentials {
  email: string;
  password: string;
}

// Initialize state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  loggedIn: false,
};

// Static API calls
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (values:any, { rejectWithValue }) => {
    try {
      // Static response
      const response = {
        id: "12345",
        email:values.email,
        name: "Demo User",
        token: "mockToken123",
      };
      toast.success("Signup successful");
      return response;
    } catch (error: any) {
      return rejectWithValue("Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: AuthCredentials, { rejectWithValue }) => {
    try {
      // Static response
      const response = {
        id: "12345",
        email,
        name: "Demo User",
        token: "mockToken123",
      };
      toast.success("Login successful");
      return response;
    } catch (error: any) {
      return rejectWithValue("Login failed");
    }
  }
);

// Redux slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loggedIn = false;
      toast.success("Logged out");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
