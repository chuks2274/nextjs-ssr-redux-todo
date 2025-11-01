// app/store/todoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"; // Import `createSlice` and `PayloadAction` from Redux Toolkit.


// Define the Todo data type
// This describes what each todo item looks like.
export interface Todo {
  id: string;          // unique ID for the todo (string, since nanoid() returns a string)
  text: string;        // the task description (e.g. "Buy groceries")
  completed: boolean;  // whether the todo is done or not
}


// Define the shape of this slice’s state
// This slice will only manage a list (array) of todos.
interface TodoState {
  todos: Todo[]; // array of Todo items
}


// ✅ Load initial state from localStorage if available
// When the app first loads, try to load todos from localStorage
const savedTodos = localStorage.getItem("todos");
const initialState: TodoState = {
  todos: savedTodos ? JSON.parse(savedTodos) : [], // fallback to empty array if nothing saved
};


// Create the slice
// `createSlice` automatically creates action creators and reducer functions for you.
const todoSlice = createSlice({
  // The name of the slice — used as a prefix in generated action types (e.g. "todos/addTodo")
  name: "todos",

  // The initial state we defined above
  initialState,

  // The `reducers` object defines how state changes in response to specific actions.
  reducers: {
    // Add a new todo
    // The action payload must be a full `Todo` object.
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload); // Add the new todo
      localStorage.setItem("todos", JSON.stringify(state.todos)); // Save updated list to localStorage
    },

    // Toggle a todo’s completed status (mark as done/undone)
    // The payload is a string (the id of the todo).
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload); // Find the todo by id
      if (todo) todo.completed = !todo.completed; // Toggle completed
      localStorage.setItem("todos", JSON.stringify(state.todos)); // Update localStorage
    },

    // Delete a todo by its id
    // The payload is again a string (id).
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload); // Remove the todo
      localStorage.setItem("todos", JSON.stringify(state.todos)); // Update localStorage
    },

    // Edit the text of an existing todo
    // Payload is an object containing { id, newText }.
    editTodo: (state, action: PayloadAction<{ id: string; newText: string }>) => {
      const todo = state.todos.find((t) => t.id === action.payload.id); // Find the todo to edit
      if (todo) todo.text = action.payload.newText; // Update the text
      localStorage.setItem("todos", JSON.stringify(state.todos)); // Update localStorage
    },

    // Clear all completed todos
    // No payload needed — simply remove all todos that are completed.
    clearCompleted: (state) => {
      state.todos = state.todos.filter((t) => !t.completed); // Remove completed todos
      localStorage.setItem("todos", JSON.stringify(state.todos)); // Update localStorage
    },
  },
});


// Export the generated action creators
// These are automatically created based on the reducer names above.
// You can dispatch them in your components (e.g., dispatch(addTodo(newTodo))).
export const { addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = todoSlice.actions;


// Export the reducer
// This reducer will be imported into the store configuration (`index.ts`).
export default todoSlice.reducer;
