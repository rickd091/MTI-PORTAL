import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Trainer } from "../../types/Trainer";
import { trainerApi } from "../../services/api/trainerApi";

export const fetchTrainers = createAsyncThunk("trainers/fetchAll", async () => {
  return await trainerApi.getAll();
});

export const createTrainer = createAsyncThunk(
  "trainers/create",
  async (trainer: Omit<Trainer, "id">) => {
    return await trainerApi.create(trainer);
  },
);

export const updateTrainerLicense = createAsyncThunk(
  "trainers/updateLicense",
  async ({ id, license }: { id: string; license: Trainer["license"] }) => {
    return await trainerApi.updateLicense(id, license);
  },
);

interface TrainerState {
  items: Trainer[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TrainerState = {
  items: [],
  status: "idle",
  error: null,
};

const trainerSlice = createSlice({
  name: "trainers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTrainerLicense.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default trainerSlice.reducer;
