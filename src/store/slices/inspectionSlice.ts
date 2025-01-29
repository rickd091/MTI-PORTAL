import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Inspection } from "../../types/Inspection";
import { inspectionApi } from "../../services/api/inspectionApi";

export const fetchInspections = createAsyncThunk(
  "inspections/fetchAll",
  async () => {
    return await inspectionApi.getAll();
  },
);

export const fetchInspectionsByInstitution = createAsyncThunk(
  "inspections/fetchByInstitution",
  async (institutionId: string) => {
    return await inspectionApi.getByInstitution(institutionId);
  },
);

export const createInspection = createAsyncThunk(
  "inspections/create",
  async (inspection: Omit<Inspection, "id">) => {
    return await inspectionApi.create(inspection);
  },
);

export const updateInspectionChecklist = createAsyncThunk(
  "inspections/updateChecklist",
  async ({
    id,
    checklist,
  }: {
    id: string;
    checklist: Inspection["checklist"];
  }) => {
    return await inspectionApi.updateChecklist(id, checklist);
  },
);

interface InspectionState {
  items: Inspection[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InspectionState = {
  items: [],
  status: "idle",
  error: null,
};

const inspectionSlice = createSlice({
  name: "inspections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInspections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInspections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchInspections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(createInspection.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateInspectionChecklist.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default inspectionSlice.reducer;
