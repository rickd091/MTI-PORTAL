import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { institutionApi, Institution } from "@/services/api/institutionApi";

export const fetchInstitutions = createAsyncThunk(
  "institutions/fetchAll",
  async (filters?: { status?: string; type?: string }) => {
    return await institutionApi.list(filters);
  },
);

export const createInstitution = createAsyncThunk(
  "institutions/create",
  async (data: Omit<Institution, "id">) => {
    return await institutionApi.create(data);
  },
);

export const updateInstitution = createAsyncThunk(
  "institutions/update",
  async ({ id, data }: { id: string; data: Partial<Institution> }) => {
    return await institutionApi.update(id, data);
  },
);

interface InstitutionState {
  items: Institution[];
  selectedInstitution: Institution | null;
  loading: boolean;
  error: string | null;
}

const initialState: InstitutionState = {
  items: [],
  selectedInstitution: null,
  loading: false,
  error: null,
};

const institutionSlice = createSlice({
  name: "institutions",
  initialState,
  reducers: {
    selectInstitution: (state, action) => {
      state.selectedInstitution = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstitutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstitutions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInstitutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch institutions";
      })
      .addCase(createInstitution.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateInstitution.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { selectInstitution, clearError } = institutionSlice.actions;
export default institutionSlice.reducer;
