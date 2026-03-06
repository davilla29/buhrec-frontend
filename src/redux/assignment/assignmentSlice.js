import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// ASYNC THUNK: Fetch assignments based on the active tab (filter)
export const fetchAssignments = createAsyncThunk(
  "assignments/fetchList",
  async (filter, { rejectWithValue }) => {
    try {
      // Assuming your API base URL is configured or using a proxy
      const response = await axios.get(
        `/admin/assignments/list?filter=${filter}`,
      );

      // Your backend returns { success: true, data: [...] }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments",
      );
    }
  },
);

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    // You can add manual state clearers here if needed
    clearAssignments: (state) => {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the "Loading" state
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // Handle the "Success" state
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // This maps to 'items' in your component
      })
      // Handle the "Error" state
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;
