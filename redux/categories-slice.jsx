import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  isEmpty: false,
  refresh: false,
  detail: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetJokes: (state) => {
      state.list.forEach((item, index) => {
        state.list[index].jokes = [];
      });
    },
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
    addJokes: (state, action) => {
      action.payload.jokes.forEach((item) => {
        state.list[action.payload.index].jokes.push(item);
      });
    },
    fetchJokesFailure: (state, action) => {
      state.list[action.payload].isLoading = false;
    },
    showDialog: (state, action) => {
      state.detail = action.payload;
    },
  },
});

export default categoriesSlice;
