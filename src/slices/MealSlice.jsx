import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMeals = createAsyncThunk(
  'meals/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');

      if (!response.data.meals) {
        return [];
      }

      return response.data.meals.map(meal => ({
        ...meal,
        price: Math.floor(Math.random() * 50000) + 10000
      })) || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  allFilteredItems: [], // All items after filtering/sorting (before pagination)
  displayedItems: [],   // Items to display (after pagination)
  categories: [],
  selectedCategory: '',
  loading: false,
  searchTerm: '',
  error: null,
  priceRange: [0, 100000],
  sortOption: '',
  currentPage: 1,
  pageSize: 8,
  totalItems: 0
};

// Helper function to apply pagination
const applyPagination = (state) => {
  const startIndex = (state.currentPage - 1) * state.pageSize;
  state.displayedItems = state.allFilteredItems.slice(
    startIndex, 
    startIndex + state.pageSize
  );
};

// Helper function to apply sorting
const applySorting = (state) => {
  if (state.sortOption) {
    let itemsToSort = [...state.allFilteredItems];
    
    switch (state.sortOption) {
      case 'price_asc':
        itemsToSort.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        itemsToSort.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        itemsToSort.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
        break;
      case 'name_desc':
        itemsToSort.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
        break;
      case 'default':
        // Get the original filtered items by reapplying filters without sorting
        itemsToSort = [...state.items]
          .filter(item => 
            item.strMeal.toLowerCase().includes(state.searchTerm.toLowerCase()) &&
            (state.selectedCategory ? item.strCategory === state.selectedCategory : true) &&
            item.price >= state.priceRange[0] &&
            item.price <= state.priceRange[1]
          );
        break;
      default:
        break;
    }
    
    state.allFilteredItems = itemsToSort;
  }
  applyPagination(state);
};

// Helper function to apply all filters
const applyFilters = (state) => {
  let filtered = [...state.items];

  // Apply search term filter
  if (state.searchTerm) {
    filtered = filtered.filter(item =>
      item.strMeal.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }

  // Apply category filter
  if (state.selectedCategory) {
    filtered = filtered.filter(item =>
      item.strCategory === state.selectedCategory
    );
  }

  // Apply price range filter
  filtered = filtered.filter(item =>
    item.price >= state.priceRange[0] &&
    item.price <= state.priceRange[1]
  );

  state.allFilteredItems = filtered;
  state.totalItems = filtered.length;
  applySorting(state);
};

const mealSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when search changes
      applyFilters(state);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset to first page when category changes
      applyFilters(state);
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      state.currentPage = 1; // Reset to first page when price range changes
      applyFilters(state);
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
      state.currentPage = 1; // Reset to first page when sort changes
      applySorting(state);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      applyPagination(state);
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
      applyPagination(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.loading = false;
        state.categories = [...new Set(action.payload.map(item => item.strCategory)) || []];
        applyFilters(state);
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setPriceRange,
  setSortOption,
  setCurrentPage,
  setPageSize
} = mealSlice.actions;

export default mealSlice.reducer;