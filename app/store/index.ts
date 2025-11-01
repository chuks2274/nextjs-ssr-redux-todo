import { configureStore } from "@reduxjs/toolkit"; // Import the `configureStore` function from Redux Toolkit.
import todoReducer from "./todoSlice"; // Import the reducer function that manages the "todos" slice of state.

// Configure the Redux store
// `configureStore` creates and configures the Redux store with sensible defaults.
// Here, we pass an object that defines the application's slices (state sections).
export const store = configureStore({
  // The `reducer` field combines all slice reducers into one root reducer.
  // In this example, we only have one slice called `todos`.
  reducer: {
    todos: todoReducer, // The key "todos" will be the name of this slice in the global state.
  },
});


// Export RootState and AppDispatch for TypeScript
// These types help TypeScript understand your store structure and dispatch behavior.

// `RootState` represents the *entire Redux state tree*.
// `ReturnType<typeof store.getState>` infers the type returned by store.getState().
export type RootState = ReturnType<typeof store.getState>;

// `AppDispatch` represents the dispatch type for the store.
// This helps ensure you can only dispatch valid Redux actions.
export type AppDispatch = typeof store.dispatch;