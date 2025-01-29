import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Program } from "../../types/Program";
import { programApi } from "../../services/api/programApi";

export const fetchPrograms = createAsyncThunk("programs/fetchAll", async () => {
  return await programApi.getAll();
});

export const fetchProgramsByInstitution = createAsyncThunk(
  "programs/fetchByInstitution",
  async (institutionId: string) => {
    return await programApi.getByInstitution(institutionId);
  },
);

export const createProgram = createAsyncThunk(
  "programs/create",
  async (program: Omit<Program, "id">) => {
    return await programApi.create(program);
  },
);

interface ProgramState {
  items: Program[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProgramState = {
  items: [],
  status: "idle",
  error: null,
};

const programSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default programSlice.reducer;
