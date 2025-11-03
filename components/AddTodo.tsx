// "use client" directive tells Next.js that this component should be rendered on the client side.
"use client"; 

import React, { useState } from "react"; // Import React and useState hook to manage component-level state.
import { useDispatch } from "react-redux"; // Import useDispatch hook to send actions to the Redux store.
import { addTodo, clearCompleted, Todo } from "../app/store/todoSlice"; // Import Redux actions and the Todo type from the todoSlice file.
import { nanoid } from "nanoid"; // Import nanoid library to generate unique IDs for each todo.
import { useTheme } from "../app/theme-provider"; // Import a custom hook to handle theme (light/dark/blue) state.
import type { AppDispatch } from "../app/store"; // Import TypeScript, defines the type for Redux dispatch.


// Define the AddTodo component
export default function AddTodo() {

   // Initialize the Redux dispatch function with correct TypeScript type
  const dispatch = useDispatch<AppDispatch>(); 

   // Access current theme and a function to toggle themes from custom hook
  const { theme, toggleTheme } = useTheme(); 

  // Local states for form fields
  // State for the todo title input
  const [title, setTitle] = useState(""); 

  // State for the optional description input
  const [description, setDescription] = useState(""); 
  
  // State for inline error message if title is empty
  const [titleError, setTitleError] = useState(""); 

  // 🧩 Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    // Prevent the default page reload behavior on form submit
    e.preventDefault(); 
    
    
    // Set an error message if the title is empty or just whitespace
    if (!title.trim()) {
      setTitleError("Title is required"); 
      // Stop further execution of this function
      return; 
    }
    // Get current date and time
    const now = new Date(); 

    // Generate a unique ID for this todo
    const newTodo: Todo = {

      // Generate a unique ID for this todo
      id: nanoid(), 
      // Set title from state
      title, 
      // Set description from state
      description, 
      // Format date as a readable string
      date: now.toLocaleDateString(), 
      // Format time as a readable string
      time: now.toLocaleTimeString(), 
      // Initialize completed state to false
      completed: false, 
    };
    // Dispatch the addTodo action to Redux store
    dispatch(addTodo(newTodo)); 

    // Reset form fields after adding a todo
    setTitle(""); 
    setDescription(""); 
    // Clear the error message
    setTitleError(""); 
    
  };

  // JSX returned by the component
  return (
    <div className={`add-todo-container ${theme}`}>
      {/* Header with theme toggle button */}
      <header className="header">
        <button className="theme-btn" onClick={toggleTheme}>
          {/* Conditional rendering to show theme icon and label */}
          {theme === "light"
            ? "☀️ Light"
            : theme === "dark"
            ? "🌙 Dark"
            : "🔵 Blue"}
        </button>
      </header>

      {/* Todo Form */}
      <form onSubmit={handleSubmit} className="todo-form">
        <label htmlFor="todo-title">Title</label>

        <input
          id="todo-title"
          className="input-field small-input"
          placeholder="Todo Title"
          value={title}
          onChange={(e) => {
            // Update title state as user types
            setTitle(e.target.value); 
            // Clear error once user types something valid
            if (e.target.value.trim()) setTitleError(""); 
          }}
        />
        {/* Inline error message displayed only if titleError is set */}
        {titleError && (
          <span style={{ color: "red", fontSize: "0.85rem", marginTop: "0.2rem", display: "block" }}>
            {titleError}
          </span>
        )}

        <label htmlFor="todo-description">Description</label>
        <textarea
          id="todo-description"
          className="textarea-field small-input"
          placeholder="Description (optional)"
          value={description}
          // Update description state as user types
          onChange={(e) => setDescription(e.target.value)} 
        />

        {/* Buttons section */}
        <div className="buttons">
          {/* Submit button triggers handleSubmit */}
          <button type="submit" className="add-btn tiny-btn shrink-btn">
            Add
          </button>

          <button
            type="button"
            className="clear-btn tiny-btn red-btn shrink-btn"
            // Dispatch clearCompleted action to remove completed todos
            onClick={() => dispatch(clearCompleted())} 
          >
            Clear Completed
          </button>
        </div>
      </form>
    </div>
  );
}
