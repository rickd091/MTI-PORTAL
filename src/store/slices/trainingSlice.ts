import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { trainingApi, TrainingProgram } from "@/services/api/trainingApi";

export const fetchPrograms = createAsyncThunk(
  "training/fetchPrograms",
  async (institutionId?: string) => {
    return await trainingApi.list(institutionId);
  },
);

export const createProgram = createAsyncThunk(
  "training/createProgram",
  async (data: Omit<TrainingProgram, "id">) => {
    return await trainingApi.create(data);
  },
);

export const updateProgram = createAsyncThunk(
  "training/updateProgram",
  async ({ id, data }: { id: string; data: Partial<TrainingProgram> }) => {
    return await trainingApi.update(id, data);
  },
);

interface TrainingState {
  programs: TrainingProgram[];
  selectedProgram: TrainingProgram | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrainingState = {
  programs: [],
  selectedProgram: null,
  loading: false,
  error: null,
};

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    selectProgram: (state, action) => {
      state.selectedProgram = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch programs";
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.programs.push(action.payload);
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        const index = state.programs.findIndex(
          (program) => program.id === action.payload.id,
        );
        if (index !== -1) {
          state.programs[index] = action.payload;
        }
      });
  },
});

export const { selectProgram, clearError } = trainingSlice.actions;
export default trainingSlice.reducer;
