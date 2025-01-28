import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Institution } from "../../types/Institution";
import apiClient from "../../services/api";

export const fetchInstitutions = createAsyncThunk(
  "institutions/fetchAll",
  async () => {
    const response = await apiClient.get<Institution[]>("/institutions");
    return response.data;
  },
);

export interface InstitutionState {
  items: Institution[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InstitutionState = {
  items: [],
  status: "idle",
  error: null,
};

const institutionSlice = createSlice({
  name: "institutions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstitutions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInstitutions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchInstitutions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default institutionSlice.reducer;
