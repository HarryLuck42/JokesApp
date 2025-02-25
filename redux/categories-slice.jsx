import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  isEmpty: false,
  refresh: false,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchCategories: (state) => {
      state.loading = true;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.isEmpty = action.payload.length === 0;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isEmpty = true;
    },
    refreshCategories: (state) => {
      console.log("refreshing now");
      state.refresh = !state.refresh;
    },
    goToTop: (state, action) => {
      state.list.unshift(action.payload.item);
      state.list.splice(action.payload.index + 1, 1);
      console.log(state.list);
    },
    addList: (state, action) => {
      state.list = [...state.list, ...action.payload];
    },
    openChild: (state, action) => {
      state.list[action.payload].isOpen = !state.list[action.payload].isOpen;
    },
    fetchJokes: (state, action) => {
      state.list[action.payload].isLoading = true;
    },
    fetchJokesSuccess: (state, action) => {
      state.list[action.payload.index].jokes = action.payload.jokes;
      state.list[action.payload.index].isLoading = false;
    },
    fetchJokesFailure: (state, action) => {
      state.list[action.payload].isLoading = false;
    },
  },
});

export default categoriesSlice;
