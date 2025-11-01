// "use client" directive tells Next.js that this component should be rendered on the client side.
"use client";

import React, { useState } from "react"; // Import React and useState hook for local component state
import { useDispatch } from "react-redux"; // Hook to dispatch actions to Redux store
import { addTodo, clearCompleted } from "../app/store/todoSlice"; // Redux actions
import { nanoid } from "nanoid"; // Library to generate unique IDs
import { useTheme } from "../app/theme-provider"; // Custom hook to access current theme and toggle function

// AddTodo component: lets users add todos and clear completed todos
export default function AddTodo() {
  const [text, setText] = useState(""); // Local state to store input value
  const dispatch = useDispatch(); // Get dispatch function from Redux
  const { theme, toggleTheme } = useTheme(); // Get current theme and toggle function

  // Handle form submission to add a new todo
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    const trimmed = text.trim(); // Remove extra whitespace
    if (!trimmed) return; // Do nothing if input is empty
    // Dispatch the addTodo action with a new Todo object
    dispatch(addTodo({ id: nanoid(), text: trimmed, completed: false }));
    setText(""); // Clear input field after adding
  };

  return (
    <div className={`add-todo ${theme}`}>
      {/* Header with theme toggle button */}
      <div className="add-todo-header">
        <button className={`theme-button ${theme}`} onClick={toggleTheme}>
          {theme === "light" ? "☀️ Light" : theme === "dark" ? "🌙 Dark" : "💙 Blue"}
        </button>
      </div>

      {/* Form to add todos */}
      <form className="add-todo-form" onSubmit={handleAdd}>
        {/* Input bound to local text state */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
          className="add-todo-input"
        />

        {/* Buttons container */}
        <div className="add-todo-buttons">
          <button type="submit" className="add-button">
            Add
          </button>
          <button
            type="button"
            className="clear-button"
            onClick={() => dispatch(clearCompleted())}
          >
            Clear completed
          </button>
        </div>
      </form>
    </div>
  );
}
